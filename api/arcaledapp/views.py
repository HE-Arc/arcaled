from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from arcaledapp.serializers import *


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        # Check if the user is already logged in
        if request.user.is_authenticated:
            return Response({'message': 'Already logged in'})
        # Verify the email and password (using Django's built-in authentication)
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)
        # If the user is not authenticated, return a response with an error message
        if user is None:
            return Response({'message': 'Invalid credentials'}, status=401)
        # Otherwise, log the user in and return a response with a success message
        login(request, user)
        return Response({'message': 'Login successful'})


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        # Log the user out
        request.user.auth_token.delete()
        return Response({'message': 'Logout successful'})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class AccessRequestViewSet(viewsets.ModelViewSet):
    queryset = AccessRequest.objects.all()
    serializer_class = AccessRequestSerializer
    permission_classes = []


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
