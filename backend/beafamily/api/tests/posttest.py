import datetime

from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from rest_framework import status
from ..models import *
from .utils import *
import json
import requests
from rest_framework.test import APIClient, APITestCase

User: AbstractBaseUser = get_user_model()


def check_exact(x, filter_dict):
    for key, val in filter_dict.items():
        if key not in x:
            continue

        if key != "date" and x[key] != val:
            return False

        if key == "date":
            if (datetime.date.today() - datetime.timedelta(days=val)) != x[key]:
                return False

    return True


def check_date_range(x, filter_dict):
    for key, val in filter_dict.items():
        if key not in x:
            continue

        if key != "date_min" and key != "date_max" and x[key] != val:
            return False

        if key == "date":
            if (datetime.date.today() - datetime.timedelta(days=val)) != x[key]:
                return False

    return datebetween(filter_dict["date_min"], filter_dict["date_max"], x["date"])


def check_age_range(x, filter_dict):
    for key, val in filter_dict.items():
        if key not in x:
            continue

        if (
            key != "date"
            and key != "age_min"
            and key != "age_max"
            and key != "age"
            and x[key] != val
        ):
            return False

        if key == "date":
            if (datetime.date.today() - datetime.timedelta(days=val)) != x[key]:
                return False

    return filter_dict["age_max"] >= x["age"] >= filter_dict["age_min"]


def datebetween(start, end, date):
    diff1 = (end - date).totalseconds()
    diff2 = (date - end).totalseconds()
    return diff1 >= 0 and diff2 >= 0


class PostTestCase(TestCase):
    def setUp(self):
        u1 = User.objects.create_user(username="abc", password="1234")
        u2 = User.objects.create_user(username="pqr", password="3456")
        self.u1 = u1
        self.u2 = u2
        p1 = Post.objects.create(
            author=u1,
            animal_type="강아지",
            neutering=True,
            vaccination=True,
            age=12,
            name="나비",
            gender=True,
            species="치와와",
            title="AAA",
            is_active=True,
            content="bbb",
        )

        photo1 = PostImage.objects.create(
            image="dummy/cat_dummy/cat2.jpg",
            post=p1,
            author=u1,
        )

        photo2 = PostImage.objects.create(
            image="dummy/cat_dummy/cat1.jpg",
            post=p1,
            author=u1,
        )
        self.p1 = p1

        p2 = Post.objects.create(
            author=u2,
            animal_type="강아지",
            neutering=True,
            vaccination=True,
            age=12,
            name="나비",
            gender=True,
            species="치와와",
            title="AAA",
            is_active=True,
            content="bbb",
        )
        photo3 = PostImage.objects.create(
            image="dummy/dog_dummy/dog.jpeg",
            post=p2,
            author=u2,
        )

        photo4 = PostImage.objects.create(
            image="dummy/dog_dummy/golden-retriever.webp",
            post=p2,
            author=u2,
        )
        self.p1 = p1
        self.p2 = p2
        self.client = Client(enforce_csrf_checks=True)
        self.post_list = [p1, p2]
        for i in range(100):
            if i % 2 == 0:
                p = Post.objects.create(
                    author=self.u1,
                    animal_type="강아지",
                    neutering=True,
                    vaccination=True,
                    age=12,
                    name="나비",
                    gender=True,
                    species="치와와",
                    title="AAA",
                    is_active=True,
                    content="bbb",
                    created_at=datetime.date.today() - datetime.timedelta(i),
                )
            else:
                p = Post.objects.create(
                    author=self.u2,
                    animal_type="고양이",
                    neutering=False,
                    vaccination=False,
                    age=12,
                    name="나비",
                    gender=True,
                    species="치와와",
                    title="AAA",
                    is_active=True,
                    content="bbb",
                    created_at=datetime.date.today() - datetime.timedelta(i % 10),
                )
            self.post_list.append(p)

    def test_getposts(self):

        reversed_list = [post_serializer(i) for i in reversed(self.post_list)]

        response = self.client.get("/api/posts/")
        self.assertEqual(response.json()["results"], reversed_list[0:20])

        response = self.client.get("/api/posts/?page=1")
        self.assertEqual(response.json()["results"], reversed_list[0:20])
        response = self.client.get("/api/posts/?page=2")
        self.assertEqual(response.json()["results"], reversed_list[20:40])
        response = self.client.get("/api/posts/?page=1&page_size=10")
        self.assertEqual(response.json()["results"], reversed_list[0:10])
        response = self.client.get("/api/posts/?page=2&page_size=10")
        self.assertEqual(response.json()["results"], reversed_list[10:20])

        response = self.client.get("/api/posts/?page=2&page_size=x")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response = self.client.get("/api/posts/?page=2&page_size=-1")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_getpost(self):
        p1 = post_serializer(self.p1)
        p2 = post_serializer(self.p2)

        response = self.client.get("/api/posts/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data, p1)

        response = self.client.get("/api/posts/131/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_deletepost(self):
        response = self.client.get("/api/token/")
        token = response.cookies["csrftoken"].value

        response = self.client.post(
            "/api/signin/",
            HTTP_X_CSRFTOKEN=token,
            HTTP_AUTHORIZATION=basic_auth_encoder("abc", "1234"),
        )

        token = response.cookies["csrftoken"].value

        response = self.client.delete("/api/posts/1/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get("/api/posts/1/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.delete("/api/posts/2/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.delete("/api/posts/130/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_putpost(self):
        response = self.client.get("/api/token/")
        token = response.cookies["csrftoken"].value

        response = self.client.post(
            "/api/signin/",
            HTTP_X_CSRFTOKEN=token,
            HTTP_AUTHORIZATION=basic_auth_encoder("abc", "1234"),
        )

        token = response.cookies["csrftoken"].value

        response = self.client.put("/api/posts/1/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.put("/api/posts/2/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.put("/api/posts/124/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_createpost(self):
        newpost = {
            "animal_type": "dd",
            "age": 134,
            "name": "adf",
            "gender": True,
            "title": "dsaf",
            "species": "dsfa",
            "neutering": True,
            "vaccination": True,
            "content": "text",
        }

        response = self.client.get("/api/token/")
        token = response.cookies["csrftoken"].value

        response = self.client.post(
            "/api/signin/",
            HTTP_X_CSRFTOKEN=token,
            HTTP_AUTHORIZATION=basic_auth_encoder("abc", "1234"),
        )
        token = response.cookies["csrftoken"].value

        with open("dummy/post/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/posts/",
                data={"photos": [], "content": json.dumps(newpost)},
                HTTP_X_CSRFTOKEN=token,
            )

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        with open("dummy/post/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/posts/",
                data={"photos": [], "content": json.dumps({"cc": "dd"})},
                HTTP_X_CSRFTOKEN=token,
            )

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        with open("dummy/post/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/posts/",
                data={"photos": [f], "content": [newpost, newpost]},
                HTTP_X_CSRFTOKEN=token,
            )

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        with open("dummy/post/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/posts/",
                data={"photos": [f], "content": newpost, "extra": {"dummy": "dummy"}},
                HTTP_X_CSRFTOKEN=token,
            )

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        with open("dummy/post/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/posts/",
                data={"photos": [f], "extra": {"dummy": "dummy"}},
                HTTP_X_CSRFTOKEN=token,
            )

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        with open("dummy/post/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/posts/",
                data={
                    "photos": [
                        f,
                    ],
                    "content": json.dumps({"no": "content"}),
                },
                HTTP_X_CSRFTOKEN=token,
            )

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        with open("dummy/post/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/posts/",
                data={
                    "photos": [
                        f,
                    ],
                    "content": json.dumps(newpost),
                },
                HTTP_X_CSRFTOKEN=token,
            )

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_invalid_query(self):

        # negative
        invalid = {"age": -1}

        response = self.client.get("/api/posts/?page=1&page_size=40", invalid)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # invalid type
        invalid = {"age_max": "x", "age_min": 1}

        response = self.client.get("/api/posts/?page=1&page_size=40", invalid)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # only min
        invalid = {"age_min": 1}

        response = self.client.get("/api/posts/?page=1&page_size=40", invalid)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_query(self):
        reversed_list = [post_serializer(i) for i in reversed(self.post_list)]

        valid = {
            "age": 3,
            "name": "해피",
            "date": 2,
            "species": "치와와",
            "animal_type": "강아지",
            "gender": True,
        }

        response = self.client.get("/api/posts/?page=1&page_size=100", valid)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected = list(filter(lambda x: check_exact(x, valid), reversed_list[0:100]))
        self.assertEqual(response.json()["results"], expected)

        valid = {
            "age": 3,
            "name": "해피",
            "species": "치와와",
            "animal_type": "강아지",
            "gender": True,
            "is_active": True,
        }

        response = self.client.get("/api/posts/?page=1&page_size=100", valid)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected = list(filter(lambda x: check_exact(x, valid), reversed_list[0:100]))
        self.assertEqual(response.json()["results"], expected)

        valid = {
            "age_min": 2,
            "age_max": 4,
            "name": "해피",
            "date": 2,
            "species": "치와와",
            "animal_type": "강아지",
        }

        response = self.client.get("/api/posts/?page=1&page_size=100", valid)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected = list(
            filter(lambda x: check_age_range(x, valid), reversed_list[0:100])
        )
        self.assertEqual(response.json()["results"], expected)

        valid = {
            "date_min": 2,
            "date_max": 4,
            "name": "해피",
            "species": "치와와",
            "animal_type": "강아지",
        }
        response = self.client.get("/api/posts/?page=1&page_size=100", valid)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected = list(
            filter(lambda x: check_date_range(x, valid), reversed_list[0:100])
        )
        self.assertEqual(response.json()["results"], expected)
