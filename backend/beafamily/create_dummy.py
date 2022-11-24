#!/usr/bin/env python
import datetime
import json
import os
import random
import shutil
import string

import tqdm

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.dev_settings")
from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()

from string import ascii_letters

from django.contrib.auth import get_user_model, models

from api.models import *
from config.dev_settings import BASE_DIR, DATA_DIR

User: models.User = get_user_model()


def get_random_post():
    names = ["해피", "나비"]
    delta = datetime.timedelta(random.randint(0, 10))
    age = random.randint(1, 25)
    len_contents = random.randint(30, 200)
    contents = "".join(random.choices(ascii_letters, k=len_contents))
    name = random.choice(names)
    animal_type = random.choice(["개", "강아지"])
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
        created_at=datetime.date.today() - delta,
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


# def create_image(path, user, category="post", number=1):
#
#     img = AbstractImageType(user=user, category=category, number=number, image=path)
#
#     img.save()
#
#     return img


def create(a, b, model_id):
    if model_id in ["q", "a"]:
        raise NotImplementedError("Not implemented Yet")
    model_name = get_model_name(model_id)

    if not os.path.exists(DATA_DIR):
        os.mkdir(DATA_DIR)
    if not os.path.exists(DATA_DIR / model_name):
        os.mkdir(DATA_DIR / model_name)

    users = list(User.objects.all().iterator())

    for i in tqdm.tqdm(range(a, b + 1)):

        ri = random.randint(0, 100)
        if ri % 2 == 0:
            animal_type = "dog"
        else:
            animal_type = "cat"

        user = random.choice(users)
        if not os.path.exists(DATA_DIR / f"{model_name}/{i}"):
            shutil.copytree(
                BASE_DIR / f"dummy/{model_name}/{animal_type}_dummy",
                DATA_DIR / f"{model_name}/{i}",
            )
        info_filename = DATA_DIR / f"{model_name}/{i}/info.json"
        with open(info_filename, "r", encoding="UTF-8") as f:
            j = json.loads(f.read())

        if model_id == "p":

            # raise NotImplementedError()
            data = get_random_post()

            data = Post.objects.create(author=user, **data)
            photos = [f"{model_name}/{i}/{p}" for p in j["photo_list"]]
            photos = [
                PostImage.objects.create(author=user, post=data, image=p)
                for p in photos
            ]
        elif model_id == "q":
            data = Question(author=user, content=DATA_DIR / f"{model_name}/{i}")
        elif model_id == "r":

            delta = datetime.timedelta(random.randint(0, 10))
            data = Review.objects.create(
                author=user,
                title=j["title"],
                content=j["content"],
                created_at=datetime.date.today() - delta,
            )
            photos = [f"{model_name}/{i}/{p}" for p in j["photo_list"]]
            photos = [
                ReviewImage.objects.create(author=user, review=data, image=p)
                for p in photos
            ]
        elif model_id == "a":
            data = Application(author=user, content=DATA_DIR / f"{model_name}/{i}")


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
    )
    a = input("Please type how many data to create(per model)\n" "Default is 100")

    try:
        a = int(a)
    except:
        print("HERE")
        a = 100

    if model in ["p", "q", "r", "a"]:
        n = 0
        if model == "p":
            n = n_post
        elif model == "q":
            n = n_question
        elif model == "r":
            n = n_review
        elif model == "a":
            n = n_application
        create(n + 1, n + a, model)
    elif model == "d":
        if n_post == 0:
            create(n_post + 1, n_post + a, "p")
        # if n_application == 0:
        #     create(1, 12, "a")
        # if n_question == 0:
        #     create(1, 12, "q")
        if n_review == 0:
            create(n_review + 1, n_review + a, "r")
    else:
        print("Quit...")
