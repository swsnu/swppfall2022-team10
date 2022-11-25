import json
import random

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser
from django.utils import timezone
from django.test import Client, TestCase
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from ..models import *
from ..serializers import QuestionSerializer
from .utils import *

User: AbstractBaseUser = get_user_model()


class QuestionTestCase(APITestCase):
    def setUp(self):
        u1 = User.objects.create_user(username="abc", password="1234")
        u2 = User.objects.create_user(username="pqr", password="3456")
        self.u1 = u1
        self.u2 = u2
        self.q1 = Question.objects.create(author=u1, title="aaa", content="bbb")
        self.q2 = Question.objects.create(author=u2, title="aaa", content="bbb")
        self.client = APIClient(enforce_csrf_checks=True)

    def test_get(self):
        response = self.client.get("/api/questions/")
        q2, q1 = QuestionSerializer(self.q2).data, QuestionSerializer(self.q1).data
        expected = [q2, q1]
        self.assertEqual(response.json()["results"], expected)
        response = self.client.get("/api/questions/1/")

        q1["editable"] = False

        self.assertEqual(response.json(), q1)

        self.client.login(username="abc", password="1234")
        response = self.client.get("/api/questions/1/")

        q1["editable"] = True

        self.assertEqual(response.json(), q1)

    def test_post(self):
        self.client.login(username="abc", password="1234")
        token = self.client.get("/api/token/").cookies["csrftoken"].value
        #
        # response = self.client.post(
        #     "/api/signin/",
        #     HTTP_X_CSRFTOKEN=token,
        #     HTTP_AUTHORIZATION=basic_auth_encoder("abc", "1234"),
        # )
        # token = response.cookies["csrftoken"].value

        response = self.client.post(
            "/api/questions/",
            data={
                "content": json.dumps({"title": "title", "content": "content"}),
            },
            HTTP_X_CSRFTOKEN=token,
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        id = response.json()["id"]

        response = self.client.get(f"/api/questions/{id}/")
        self.assertEqual(response.json()["title"], "title")
        self.assertEqual(response.json()["content"], "content")

    def test_delete(self):
        response = self.client.delete("/api/questions/1/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.login(username="abc", password="1234")
        token = self.client.get("/api/token/").cookies["csrftoken"].value

        response = self.client.delete("/api/questions/1/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(f"/api/questions/1/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.delete("/api/questions/2/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_put(self):
        response = self.client.put("/api/questions/1/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.login(username="abc", password="1234")
        token = self.client.get("/api/token/").cookies["csrftoken"].value

        response = self.client.put("/api/questions/1/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.put("/api/questions/2/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
