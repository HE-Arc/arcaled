from rest_framework.views import APIView
from rest_framework.decorators import action
from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from arcaledapp.serializers import *
from .email_validation import is_student


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return # No CSRF check


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
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
            password=password
        )
        # Delete the access request (we don't need it anymore)
        access_request.delete()
        # TODO: send an email to the user with the password
        # ...
        # ...
        # ...
        # Return a response with the email and password of the new user
        return Response({
            'email': user.email,
            'password': password
        })



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class AccessRequestViewSet(viewsets.ModelViewSet):
    queryset = AccessRequest.objects.all()
    serializer_class = AccessRequestSerializer
    permission_classes = []
    def create(self, request, *args, **kwargs):
        # Create the access request
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Get the email from the request data
        email = serializer.validated_data['email']
        # Delete the freshly created access request
        # if the email is not from a student
        if not is_student(email):
            AccessRequest.objects.filter(email=email).delete()
            return Response({'message': 'Invalid email'}, status=400)
        return Response({'message': 'Access request created'})



class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [permissions.IsAuthenticated]


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAuthenticated]


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]
