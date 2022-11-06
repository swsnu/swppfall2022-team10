from django.urls import path
from . import views

urlpatterns = [
    path("posts/", views.posts),
    path("posts/<int:pid>/", views.post_id),
    path("reviews/", views.reviews),
    path("reviews/<int:rid>/", views.review_id)
]
