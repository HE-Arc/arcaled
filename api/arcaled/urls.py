from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from arcaledapp import views
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


router = routers.DefaultRouter()
router.register('users', views.UserViewSet)
router.register('access-requests', views.AccessRequestViewSet)
router.register('branches', views.BranchViewSet)
router.register('teachers', views.TeacherViewSet)
router.register('lessons', views.LessonViewSet)
router.register('exams', views.ExamViewSet)

urlpatterns = [
    # API :
    path('api/', include(router.urls)),
    path('api/login/', views.LoginView.as_view()),
    path('api/logout/', views.LogoutView.as_view()),
    path('api/accept-access-request/', views.AcceptAccessRequestView.as_view()),
    path('api/reject-access-request/', views.RejectAccessRequestView.as_view()),
    path('api/ratio/', views.RatioView.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/admin/', admin.site.urls),
    path('api/media/exam_contents/<path:filename>',
         views.ExamContentView.as_view()),
    # API Schema:
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/',
         SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
