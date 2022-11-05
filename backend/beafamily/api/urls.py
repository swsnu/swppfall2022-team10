from django.urls import path
from . import views

urlpatterns = [
    path("posts/", views.getPostList),
    path("posts/<int:pid>/", views.getPost),
    path("reviews/", views.getReviewList),
    path("reviews/<int:rid>/", views.getReview)
]
