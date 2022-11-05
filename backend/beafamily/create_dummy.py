#!/usr/bin/env python
import os
import shutil
import random
import json
import string

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'beafamily.settings')
from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()

from api.models import *
from beafamily.settings import DATA_DIR, BASE_DIR
from django.contrib.auth import get_user_model
from django.contrib.auth import models
from django.core.files import File
from django.db.models import ImageField

User: models.User = get_user_model()


def get_model_name(model_id):
    if model_id == 'p':
        return 'post'
    elif model_id == 'q':
        return 'question'
    elif model_id == 'r':
        return 'review'
    elif model_id == 'a':
        return 'application'

    return ''


def create_image(path, user, category='post', number=1):

    img = Image(
        user=user,
        category=category,
        number=number,
        image=path
    )

    img.save()

    return img


def create(a, b, model_id):
    model_name = get_model_name(model_id)

    if not os.path.exists(DATA_DIR):
        os.mkdir(DATA_DIR)
    if not os.path.exists(DATA_DIR / model_name):
        os.mkdir(DATA_DIR / model_name)

    users = list(User.objects.all().iterator())

    for i in range(a, b + 1):

        ri = random.randint(0, 100)
        if ri % 2 == 0:
            animal_type = 'dog'
        else:
            animal_type = 'cat'

        # user = User.objects.get(username="yeomjy")
        user = random.choice(users)
        if not os.path.exists(DATA_DIR / f'{model_name}/{i}'):
            shutil.copytree(BASE_DIR / f'dummy/{model_name}/{animal_type}_dummy', DATA_DIR / f'{model_name}/{i}')

        info_filename = DATA_DIR / f'{model_name}/{i}/info.json'
        with open(info_filename, "r") as f:
            j = json.loads(f.read())

        if model_id == 'p':

            photos = [f'{model_name}/{i}/{p}' for p in j['photo_list']]
            photos = [
                create_image(p, user, 'post', i)
                for p in photos
            ]

            # raise NotImplementedError()

            data = Post(
                author=user,
                animal_type=j['animal_type'],
                neutering=j['neutering'],
                vaccination=j['vaccination'],
                age=j['age'],
                name=j['name'],
                gender=j['gender'],
                species=j['species'],
                title=j['title'],
                is_active=j['is_active'],
                content={
                    'photo_list': [i.id for i in photos],
                    'text': j['text']
                }
            )
        elif model_id == 'q':
            data = Question(
                author=user,
                content=DATA_DIR / f'{model_name}/{i}'
            )
        elif model_id == 'r':

            photos = [f'{model_name}/{i}/{p}' for p in j['photo_list']]
            photos = [
                create_image(p, user, 'review', i)
                for p in photos
            ]

            data = Review(
                author=user,
                title=j['title'],
                content= {
                    'photo_list': [i.id for i in photos],
                    'text': j['text']
                }
            )
        elif model_id == 'a':
            data = Application(
                author=user,
                content=DATA_DIR / f'{model_name}/{i}'
            )

        data.save()


if __name__ == '__main__':
    n_post = len(Post.objects.all())
    n_review = len(Review.objects.all())
    n_application = len(Application.objects.all())
    n_question = len(Question.objects.all())
    n_image = len(Image.objects.all())
    n_user = len(User.objects.all())


    print('-' * 30)
    print('current status:')
    print(f'Number of posts: {n_post}')
    print(f'Number of reviews: {n_review}')
    print(f'Number of applications: {n_application}')
    print(f'Number of questions: {n_question}')
    print(f'Number of users: {n_user}')
    print(f'Number of images: {n_image}')
    print('-' * 30)

    if n_user == 0:
        alphabets = string.ascii_lowercase + string.ascii_uppercase + string.digits

        for _ in range(5):
            length = random.randint(4, 12)
            random_name = ''.join(random.choices(alphabets, k=length))

            user = User.objects.create_user(username=random_name)

            print(f"Created random user with username: {random_name}")
    model = input("Please type which model to create dummy\n"
                  "p: Post, r: Review, a: Application, q: Question, d: Default, otherwise: Quit\n"
                  "Default: create every model which has zero element\n")

    if model in ['p', 'q', 'r', 'a']:
        if model in ['q', 'a']:
            raise NotImplementedError("Not implemented Yet")
        create(1, 12, model)
    elif model == 'd':
        if n_post == 0:
            create(1, 12, 'p')
        if n_application == 0:
            create(1, 12, 'a')
        if n_question == 0:
            create(1, 12, 'q')
        if n_review == 0:
            create(1, 4, 'r')
    else:
        print("Quit...")
