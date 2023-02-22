from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from arcaledapp import views
from django.conf import settings
from django.conf.urls.static import static


router = routers.DefaultRouter()
router.register('users', views.UserViewSet)
router.register('access-requests', views.AccessRequestViewSet)
router.register('branches', views.BranchViewSet)
router.register('teachers', views.TeacherViewSet)
router.register('lessons', views.LessonViewSet)
router.register('exams', views.ExamViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
