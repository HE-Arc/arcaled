from django.db import models


class AccessRequest(models.Model):
    email = models.EmailField(max_length=200, unique=True)
    proof = models.ImageField(upload_to='access_proofs/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email + ' at ' + self.created_at.strftime('%Y-%m-%d %H:%M:%S')


class Branch(models.Model):
    label = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.label


class Teacher(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Lesson(models.Model):
    branch = models.ForeignKey(
        'Branch', on_delete=models.CASCADE, related_name='lesson')
    teacher = models.ForeignKey(
        'Teacher', on_delete=models.CASCADE, related_name='lesson')
    year = models.DateField()

    def __str__(self):
        return self.branch.label + ' - ' + self.teacher.name + ' - ' + self.year.strftime('%Y')


class Exam(models.Model):
    lesson = models.ForeignKey(
        'Lesson', on_delete=models.CASCADE, related_name='exam')
    content = models.FileField(upload_to='exam_contents/')

    def __str__(self):
        return 'Exam of ' + str(self.lesson)


class MemberRatio(models.Model):
    ratio = models.IntegerField()
    user = models.ForeignKey(
        'auth.User', on_delete=models.CASCADE, related_name='member_ratio')

    def __str__(self):
        return self.user.username + ' - ' + str(self.ratio)
