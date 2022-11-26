#!/usr/bin/env python
import os
import random

import tqdm

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.dev_settings")
from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()

from string import ascii_letters

from django.contrib.auth import get_user_model, models

from api.models import *
from config.dev_settings import BASE_DIR, DATA_DIR
from django.utils import timezone


# User: User = get_user_model()


def get_random_review():
    animal_type = random.choice(["고양이", "개"])
    title = f"{animal_type}가 아주 귀여워요!"
    content = title
    delta = timezone.timedelta(random.randint(0, 10))

    return (
        dict(title=title, content=content, created_at=timezone.now() - delta),
        animal_type,
    )


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
    else:
        species = random.choice(cat_species)

    gender, vaccination, neutering, is_active = random.choices([True, False], k=4)

    return dict(
        animal_type=animal_type,
        neutering=neutering,
        vaccination=vaccination,
        age=age,
        name=name,
        gender=gender,
        species=species,
        title=f"{animal_type} {name} 입양하실 분 구해요",
        is_active=is_active,
        content=contents,
        created_at=timezone.now() - delta,
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


def create(a, b, model_id):
    model_name = get_model_name(model_id)

    if not os.path.exists(DATA_DIR):
        os.mkdir(DATA_DIR)
    if not os.path.exists(DATA_DIR / model_name):
        os.mkdir(DATA_DIR / model_name)

    users = list(User.objects.all().iterator())

    for i in tqdm.tqdm(range(a, b + 1)):

        user = random.choice(users)
        cat_list = [
            "dummy/post/cat_dummy/cat.webp",
            "dummy/post/cat_dummy/cat2.jpg",
            "dummy/post/cat_dummy/cat3.jpg",
        ]
        dog_list = [
            "dummy/post/dog_dummy/dog.jpeg",
            "dummy/post/dog_dummy/golden-retriever.webp",
        ]

        if model_id == "p":
            data = get_random_post()

            post = Post.objects.create(author=user, **data)
            post.created_at = data["created_at"]
            post.save()

            animal_type = post.animal_type == "개"

            photos = dog_list if animal_type else cat_list
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

        elif model_id == "q":
            data = Question.objects.create(
                author=user, content=f"content_{i}", title="title_{i}"
            )
        elif model_id == "r":

            data, animal_type = get_random_review()

            review = Review.objects.create(author=user, animal_type=animal_type, **data)
            review.created_at = data["created_at"]
            review.save()

            photos = dog_list if animal_type == "개" else cat_list
            photos = [
                ReviewImage.objects.create(author=user, review=review, image=p)
                for p in photos
            ]
        elif model_id == "a":
            posts = list(Post.objects.all().iterator())

            post = random.choice(posts)
            data = Application.objects.create(
                author=user, content=f"content_{i}", title="title_{i}", post=post
            )


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

    if n_user == 0:
        yn = input("Create user? [Y/n] ")
        if yn.lower() == "y" or yn == "":
            usernames = ["yeomjy", "seorin55", "lenyakim", "jhpyun"]
            passwords = ["1q2w3e4r", "password", "12345678", "qwerty"]

            for un, pw in zip(usernames, passwords):
                u = User.objects.create(username=un)
                u.set_password(pw)
                u.save()

        else:
            print("You should first create user...")
            exit()

    model = input(
        "Please type which model to create dummy\n"
        "p: Post, r: Review, a: Application, q: Question, d: Default, otherwise: Quit\n"
        "Default: create every model which has zero element\n"
        "Number to create: (50, 50, 30, 40)"
    )
    a_p, a_q, a_r, a_a = (50, 50, 30, 40)

    if model in ["p", "q", "r", "a"]:
        n = 0
        if model == "p":
            n = n_post
            a = a_p
        elif model == "q":
            n = n_question
            a = a_q
        elif model == "r":
            n = n_review
            a = a_r
        elif model == "a":
            n = n_application
            a = a_a
        create(n + 1, n + a, model)
    elif model == "d":
        if n_post == 0:
            create(n_post + 1, n_post + a_p, "p")
        if n_application == 0:
            create(n_application + 1, n_application + a_a, "a")
        if n_question == 0:
            create(n_question + 1, n_question + a_q, "q")
        if n_review == 0:
            create(n_review + 1, n_review + a_r, "r")

        users: list[User] = list(User.objects.all().iterator())
        posts = list(Post.objects.all().iterator())

        for u in users:
            posts_to_like = random.choices(posts, k=3)
            for p in posts_to_like:
                u.likes.add(p)
    else:
        print("Quit...")
