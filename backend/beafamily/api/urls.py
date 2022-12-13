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
    path("users/post/", views.user_post),
    # path("posts/<int:pid>/comments/"), GET / POST / PUT / DELETE comments
    path("questions/<int:qid>/comments/", views.questions_comment),
    path("questions/<int:qid>/comments/<int:cid>/", views.question_comment_id),
    path(
        "posts/<int:pid>/applications/", views.post_id_application
    ),  # POST: add new application
    path(
        "posts/<int:pid>/applications/<int:aid>/", views.post_id_application_id
    ),  # GET, PUT: Update application, DELETE: Delete application
    path("posts/<int:pid>/applications/<int:aid>/accept/", views.accept),
    path("signup/", views.signup),
    path("username/", views.check_username),
    path("posts/<int:pid>/bookmark/", views.post_bookmark),
    path("users/", views.delete_user),
    path("posts/<int:pid>/photos/<int:iid>/", views.delete_post_photo),
    path("reviews/check/", views.review_check),
]
