from django.contrib import admin
from .models import *

class AccessRequestAdmin(admin.ModelAdmin):
    list_display = ('email', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('email',)
    ordering = ('-created_at',)

class BranchAdmin(admin.ModelAdmin):
    list_display = ('label',)
    search_fields = ('label',)
    ordering = ('label',)

class TeacherAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)

class LessonAdmin(admin.ModelAdmin):
    list_display = ('branch', 'teacher', 'year')
    list_filter = ('branch', 'teacher', 'year')
    search_fields = ('branch', 'teacher', 'year')
    ordering = ('branch', 'teacher', 'year')

class ExamAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'content')
    list_filter = ('lesson', 'content')
    search_fields = ('lesson', 'content')
    ordering = ('lesson', 'content')

class MemberRatioAdmin(admin.ModelAdmin):
    list_display = ('user', 'ratio')
    list_filter = ('user', 'ratio')
    search_fields = ('user', 'ratio')
    ordering = ('user', 'ratio')

admin.site.register(AccessRequest, AccessRequestAdmin)
admin.site.register(Branch, BranchAdmin)
admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Lesson, LessonAdmin)
admin.site.register(Exam, ExamAdmin)
admin.site.register(MemberRatio, MemberRatioAdmin)
