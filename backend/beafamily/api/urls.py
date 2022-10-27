from django.urls import path
from . import views

urlpatterns = [path("", views.getPostList), path("<int:pid>/", views.getPost)]
