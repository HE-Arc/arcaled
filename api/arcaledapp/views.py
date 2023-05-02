from __future__ import print_function
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from arcaledapp.serializers import *
from .email_validation import is_student
from .models import MemberRatio
from django.conf import settings
import time
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from pprint import pprint


# Custom permissions


# Unauthenticated users : Create access
# Authenticated users : Create access
# Admin users : Total access
class AnyoneCreatePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow POST requests
        if request.method == 'POST':
            return True
        # Allow other methods only if the user is an admin
        return request.user.is_authenticated and request.user.is_staff


# Unauthenticated users : No access
# Authenticated users : Read access
# Admin users : Total access
class ReadOnlyPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Refuse unauthenticated users
        if not request.user.is_authenticated:
            return False
        # Allow GET, HEAD and OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow other methods only if the user is an admin
        return request.user.is_staff


# Unauthenticated users : No access
# Authenticated users : Create and Read access
# Admin users : Total access
class CreateReadPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Refuse unauthenticated users
        if not request.user.is_authenticated:
            return False
        # Allow GET, HEAD and OPTIONS requests
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow POST requests
        if request.method == 'POST':
            return True
        # Allow PUT, PATCH and DELETE requests only if the user is an admin
        return request.user.is_staff


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # No CSRF check


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [
        CsrfExemptSessionAuthentication, BasicAuthentication]

    def post(self, request):
        # Check if the user is already logged in
        if request.user.is_authenticated:
            # Logout and login again
            logout(request)
        # Verify the email and password (using Django's built-in authentication)
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)
        # If the user is not authenticated, return a response with an error message
        if user is None:
            return Response({'message': 'Invalid credentials'}, status=401)
        # Otherwise, log the user in and return a response with a success message
        login(request, user)
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'is_admin': user.is_staff,
            }
        })


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [
        CsrfExemptSessionAuthentication, BasicAuthentication]

    def post(self, request):
        # Log the user out
        logout(request)
        return Response({'message': 'Logout successful'})


class AcceptAccessRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request):
        # Get the ID of the access request to accept
        access_request_id = request.data.get('id')
        # Get the access request
        try:
            access_request = AccessRequest.objects.get(id=access_request_id)
        except AccessRequest.DoesNotExist:
            return Response({'message': 'Access request not found'}, status=404)
        email = access_request.email
        # Create a new user with the email from the access request
        # and a randomly generated password
        password = User.objects.make_random_password()
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
        )
        # Create a new MemberRatio object for the new user
        MemberRatio.objects.create(
            user=user,
            ratio=5,
        )
        # Delete the access request (we don't need it anymore)
        access_request.delete()

        # Send an email to the user with the password

        # https://github.com/sendinblue/APIv3-python-library

        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = settings.SENDINBLUE_API_KEY

        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(configuration))
        subject = "Confirmation de demande d'accès"
        html_content = "<html><body><h1>Votre demande d'accès à ARCALED a été acceptée 🔥👍</h1><br> Vous pouvez vous connecter à l'adresse suivante :  <a href=\"https://arc-aled.k8s.ing.he-arc.ch/login\" target=\"_blank\">https://arc-aled.k8s.ing.he-arc.ch/login</a> <br> Votre mail est : <strong>{email}</strong>  <br> Votre mot de passe est : <strong>{password}</strong> <br><br>LA TEAM ARCALED 😘 </body></html>".format(
            email=email, password=password)
        sender = {"name": "Arcaled", "email": email}
        to = [{"email": email}]
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=to, html_content=html_content, sender=sender, subject=subject)

        try:
            api_response = api_instance.send_transac_email(send_smtp_email)
            pprint(api_response)
        except ApiException as e:
            print("Exception when calling SMTPApi->send_transac_email: %s\n" % e)

        # Return a response with the email and password of the new user
        return Response({
            'message': 'Access request accepted',
        })


class RejectAccessRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request):
        # Get the ID of the access request to reject
        access_request_id = request.data.get('id')
        # Get the access request
        try:
            access_request = AccessRequest.objects.get(id=access_request_id)
        except AccessRequest.DoesNotExist:
            return Response({'message': 'Access request not found'}, status=404)
        # Delete the access request
        access_request.delete()
        return Response({'message': 'Access request rejected'})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [ReadOnlyPermission]


class AccessRequestViewSet(viewsets.ModelViewSet):
    queryset = AccessRequest.objects.all()
    serializer_class = AccessRequestSerializer
    permission_classes = [AnyoneCreatePermission]

    def create(self, request, *args, **kwargs):
        # Get the serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Get the email from the request data
        email = serializer.validated_data['email']
        # Check if the email is not from a student
        if not is_student(email):
            return Response({'message': 'Invalid email'}, status=400)
        # Check if the email is not already in another access request
        if AccessRequest.objects.filter(email=email).exists():
            return Response({'message': 'Access request already exists'}, status=400)
        # Check if the email is not already in the User model
        if User.objects.filter(email=email).exists():
            return Response({'message': 'User already exists'}, status=400)
        # Create the access request
        self.perform_create(serializer)
        return Response({'message': 'Access request created'})


class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [CreateReadPermission]


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [CreateReadPermission]


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [CreateReadPermission]


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [CreateReadPermission]

    def create(self, request, *args, **kwargs):
        # Get the serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Create the exam
        self.perform_create(serializer)
        # Increment the ratio of the user who created the exam by 20
        user = request.user
        member_ratio = MemberRatio.objects.get(user=user)
        member_ratio.ratio += 2
        member_ratio.save()
        return Response({'message': 'Exam created'})


class ExamContentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, filename):
        # Get the user's ratio
        user = request.user
        member_ratio = MemberRatio.objects.get(user=user)
        # If the user's ratio is less than 1, return an error response
        if member_ratio.ratio < 1:
            return Response({'message': 'Not enough ratio'}, status=403)
        member_ratio.ratio -= 1
        member_ratio.save()
        # Return the requested file
        return FileResponse(open('media/exam_contents/' + filename, 'rb'))


class RatioView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get the user's ratio
        user = request.user
        member_ratio = MemberRatio.objects.get(user=user)
        # Return the user's ratio
        return Response({
            'ratio': member_ratio.ratio,
        })
