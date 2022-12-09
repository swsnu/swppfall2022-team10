#!/usr/bin/env python
import os
import random

import tqdm
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.dev_settings")
from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()

from string import ascii_letters

from django.contrib.auth import get_user_model, models

from api.models import *
from config.dev_settings import BASE_DIR, DATA_DIR
from django.utils import timezone


# User: User = get_user_model()


def get_random_review(animal_type):
    title = f"{animal_type}가 아주 귀여워요!"
    content = title
    delta = timezone.timedelta(random.randint(0, 10))

    return dict(title=title, content=content, created_at=timezone.now() - delta)


def get_random_post():
    names = ["해피", "나비"]
    delta = timezone.timedelta(random.randint(0, 10))
    age = random.randint(1, 25)
    len_contents = random.randint(30, 200)
    contents = "".join(random.choices(ascii_letters, k=len_contents))
    name = random.choice(names)
    animal_type = random.choice(["고양이", "개"])

    dog_species = [
        "포메라니안",
        "치와와",
        "파피용",
        "닥스훈트",
        "요크셔테리어",
        "말티즈",
        "슈나우저",
        "시츄",
        "푸들",
        "웰시코기",
    ]
    cat_species = [
        "러시안 블루",
        "페르시안",
        "뱅갈",
        "봄베이",
        "샴",
        "메인쿤",
        "스코티쉬폴드",
        "아메리칸 숏헤이",
        "캘리포니아 스팽글드",
        "이집트안마우",
    ]

    if animal_type == "개":
        species = random.choice(dog_species)
        form = "dummy/post/dog_dummy/dog_form.docx"
    else:
        species = random.choice(cat_species)
        form = "dummy/post/cat_dummy/cat_form.docx"

    gender, vaccination, neutering = random.choices([True, False], k=3)

    return dict(
        animal_type=animal_type,
        neutering=neutering,
        vaccination=vaccination,
        age=age,
        name=name,
        gender=gender,
        species=species,
        title=f"{animal_type} {name} 입양하실 분 구해요",
        is_active=True,
        content=contents,
        created_at=timezone.now() - delta,
        form=form,
    )


def get_model_name(model_id):
    if model_id == "p":
        return "post"
    elif model_id == "q":
        return "question"
    elif model_id == "r":
        return "review"
    elif model_id == "a":
        return "application"

    return ""


def create():
    n_post = 50
    n_question = 20

    if not os.path.exists(DATA_DIR):
        os.mkdir(DATA_DIR)
    if not os.path.exists(DATA_DIR / 'post'):
        os.mkdir(DATA_DIR / 'post')
    if not os.path.exists(DATA_DIR / 'application'):
        os.mkdir(DATA_DIR / 'application')
    if not os.path.exists(DATA_DIR / 'review'):
        os.mkdir(DATA_DIR / 'review')
    if not os.path.exists(DATA_DIR / 'question'):
        os.mkdir(DATA_DIR / 'question')

    users: list[User] = list(User.objects.all().iterator())
    cat_list = [
        "dummy/post/cat_dummy/cat.webp",
        "dummy/post/cat_dummy/cat2.jpg",
        "dummy/post/cat_dummy/cat3.jpg",
    ]
    dog_list = [
        "dummy/post/dog_dummy/dog.jpeg",
        "dummy/post/dog_dummy/golden-retriever.webp",
    ]

    for i in tqdm.tqdm(range(0, n_post)):
        user = random.choice(users)

        data = get_random_post()

        post = Post.objects.create(author=user, **data)
        post.created_at = data["created_at"]

        animal_type = post.animal_type == "개"

        photos = dog_list if animal_type else cat_list
        post.thumbnail = photos[0]
        post.save()
        photos = [
            PostImage.objects.create(author=user, post=post, image=p)
            for p in photos
        ]
        num_comments = random.randint(0, 5)
        user_comment = random.choices(users, k=num_comments)
        comments = [
            PostComment.objects.create(author=u, content="comment", post=post)
            for u in user_comment
        ]
    for i in tqdm.tqdm(range(0, n_question)):
        user = random.choice(users)
        data = Question.objects.create(
            author=user, content=f"content_{i}", title=f"title_{i}"
        )
        num_comments = random.randint(0, 5)
        user_comment = random.choices(users, k=num_comments)
        comments = [
            QuestionComment.objects.create(
                author=u, content="comment", question=data
            )
            for u in user_comment
        ]

        posts = list(Post.objects.all().iterator())

    posts = list(Post.objects.all().iterator())
    n_post = len(posts)
    is_actives = random.choices([True, False], k=n_post)
    num_app = random.choices(range(0, 4), k=n_post)
    for i, post in enumerate(tqdm.tqdm(posts)):
        user_excluded = set(users)
        user_excluded.discard(post.author)
        user_excluded = list(user_excluded)
        post.is_active = is_actives[i]
        post.save()
        num = num_app[i]
        if post.is_active:
            for j in range(0, num):
                user = user_excluded[j]
                data = Application.objects.create(
                    author=user, post=post, file="dummy/post/dog_dummy/dog_form.docx"
                )
        else:
            # Must have at least 1 application
            if num == 0:
                num = 1
            selected = random.randint(0, num - 1)
            for j in range(0, num):
                user = user_excluded[j]
                data = Application.objects.create(
                    author=user, post=post, file="dummy/post/dog_dummy/dog_form.docx"
                )
                if j == selected:
                    post.accepted_application = data
                    post.save()

    for post in tqdm.tqdm(posts):
        if post.is_active or hasattr(post, 'review_post'):
            continue
        animal_type = post.animal_type
        data = get_random_review(animal_type)
        user = post.accepted_application.author

        review = Review.objects.create(author=user, post=post, animal_type=animal_type, **data)
        review.created_at = data["created_at"]

        photos = dog_list if animal_type == "개" else cat_list
        review.thumbnail = photos[0]
        review.save()
        photos = [
            ReviewImage.objects.create(author=user, review=review, image=p)
            for p in photos
        ]


if __name__ == "__main__":
    n_post = len(Post.objects.all())
    n_review = len(Review.objects.all())
    n_application = len(Application.objects.all())
    n_question = len(Question.objects.all())
    n_pimage = len(PostImage.objects.all())
    n_rimage = len(ReviewImage.objects.all())
    n_user = len(User.objects.all())

    print("-" * 30)
    print("current status:")
    print(f"Number of posts: {n_post}")
    print(f"Number of reviews: {n_review}")
    print(f"Number of applications: {n_application}")
    print(f"Number of questions: {n_question}")
    print(f"Number of users: {n_user}")
    print(f"Number of post images: {n_pimage}")
    print(f"Number of review images: {n_rimage}")
    print("-" * 30)

    if len(sys.argv) > 1 and sys.argv[1] == "--stat":
        exit(0)

    if n_user == 0:
        usernames = ["yeomjy", "seorin55", "lenyakim", "jhpyun"]
        passwords = ["1q2w3e4r", "password", "12345678", "qwerty"]
        nicknames = ["염준영", "최서린", "김수빈", "편진희"]

        for un, pw, nn in zip(usernames, passwords, nicknames):
            u = User.objects.create_user(username=un, password=pw, nickname=nn)

    create()

    # check all data are valid

    pls: list[Post] = list(Post.objects.all().iterator())
    for p in pls:
        if not p.is_active:
            if not p.accepted_application:
                raise Exception()
        else:
            if p.accepted_application:
                raise Exception()
            if hasattr(p, 'review_post'):
                raise Exception()

        for app in p.applications.all():
            if app.author == p.author:
                raise Exception()

            if not p.is_active:
                if p.accepted_application not in p.applications.all():
                    raise Exception()

        if hasattr(p, 'review_post'):
            if p.review_post.author != p.accepted_application.author:
                raise Exception()

    for r in Review.objects.all().iterator():
        if r.author != r.post.accepted_application.author:
            raise Exception()
