from django.db import models

# Create your models here.

class ImageTest(models.Model):
    image = models.ImageField(upload_to="test_image/%Y/%m/%d")

