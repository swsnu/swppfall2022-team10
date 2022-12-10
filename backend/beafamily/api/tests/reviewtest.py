import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser
from django.test import Client, TestCase
from rest_framework import status

from ..models import *
from .utils import *
from ..serializers import ReviewDetailSerializer, ReviewListSerializer

User: AbstractBaseUser = get_user_model()


class ReviewTestCase(TestCase):
    def setUp(self):
        create_all()
        self.reviews = Review.objects.all()
        self.r1 = self.reviews.get(id=1)

        self.client = Client(enforce_csrf_checks=True)

    def test_getreview(self):
        response = self.client.get("/api/reviews/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        r1 = ReviewDetailSerializer(self.r1).data
        expected = ReviewListSerializer(self.reviews, many=True).data
        self.assertEqual(response.json()["results"], expected)

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
            HTTP_AUTHORIZATION=basic_auth_encoder("yeomjy", "1q2w3e4r"),
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
                    "post_id": 5,
                },
                HTTP_X_CSRFTOKEN=token,
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
