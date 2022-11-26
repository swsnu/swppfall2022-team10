from django.urls import path

from . import views

urlpatterns = [
    path("posts/", views.posts),
    path("posts/<int:pid>/", views.post_id),
    path("reviews/", views.reviews),
    path("reviews/<int:rid>/", views.review_id),
    path("signin/", views.signin),
    path("signout/", views.signout),
    path("token/", views.token),
    path("check/", views.check_login),
    path("questions/", views.questions),
    path("questions/<int:qid>/", views.question_id),
    # TODO:
    # path("users/", views),
    path("users/info/", views.user_info),
    path("users/post/", views.user_post)
    # path("posts/<int:pid>/comments/"), GET / POST / PUT / DELETE comments
    # path("questions/<int:qid>/comments/"), GET / POST / PUT / DELETE comments
    # path("apply/") GET / POST application
    # path("apply/<int:aid>/) GET / PUT / DELETE application
]
