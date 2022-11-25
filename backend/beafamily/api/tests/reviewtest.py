import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser
from django.test import Client, TestCase
from rest_framework import status

from ..models import *
from .utils import *
from ..serializers import ReviewSerializer

User: AbstractBaseUser = get_user_model()


class ReviewTestCase(TestCase):
    def setUp(self):
        u1 = User.objects.create_user(username="abc", password="1234")
        u2 = User.objects.create_user(username="pqr", password="3456")
        r1 = Review.objects.create(
            author=u1, title="title", content="content", animal_type="고양이"
        )
        photo1 = ReviewImage.objects.create(
            image="dummy/cat_dummy/cat2.jpg",
            review=r1,
            author=u1,
        )

        photo2 = ReviewImage.objects.create(
            image="dummy/cat_dummy/cat1.jpg",
            review=r1,
            author=u1,
        )

        r2 = Review.objects.create(
            author=u2, title="title", content="content", animal_type="개"
        )
        photo3 = ReviewImage.objects.create(
            image="dummy/dog_dummy/dog.jpeg",
            review=r2,
            author=u2,
        )

        photo4 = ReviewImage.objects.create(
            image="dummy/dog_dummy/golden-retriever.webp",
            review=r2,
            author=u2,
        )
        self.u1 = u1
        self.u2 = u2
        self.r1 = r1
        self.r2 = r2
        self.client = Client(enforce_csrf_checks=True)

    def test_getreview(self):
        response = self.client.get("/api/reviews/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        r1 = ReviewSerializer(self.r1).data
        r2 = ReviewSerializer(self.r2).data
        self.assertEqual(response.json()["results"], [r2, r1])

        response = self.client.get("/api/reviews/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), r1)

        response = self.client.get("/api/reviews/11/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.get("/api/reviews/?page=1&page_size=-1")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.get("/api/reviews/?page=-1")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_createreview(self):
        response = self.client.get("/api/token/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        token = response.cookies["csrftoken"].value
        response = self.client.post(
            "/api/signin/",
            HTTP_AUTHORIZATION=basic_auth_encoder("abc", "1234"),
            HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.cookies["csrftoken"].value

        newreview = {"title": "abc", "content": "xyz", "animal_type": "pqr"}

        with open("dummy/review/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/reviews/",
                data={
                    "content": [json.dumps(newreview), json.dumps(newreview)],
                    "photos": [
                        f,
                    ],
                },
                HTTP_X_CSRFTOKEN=token,
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        with open("dummy/review/cat_dummy/info.json", "rb") as f:
            response = self.client.post(
                "/api/reviews/",
                data={
                    "content": json.dumps(newreview),
                    "photos": [
                        f,
                    ],
                },
                HTTP_X_CSRFTOKEN=token,
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        with open("dummy/review/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/reviews/",
                data={
                    "content": json.dumps({"no": "content"}),
                    "photos": [
                        f,
                    ],
                },
                HTTP_X_CSRFTOKEN=token,
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        with open("dummy/review/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/reviews/",
                data={
                    "content": json.dumps(newreview),
                    "photos": [
                        f,
                    ],
                },
                HTTP_X_CSRFTOKEN=token,
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
