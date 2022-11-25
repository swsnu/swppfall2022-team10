from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser
from django.test import Client, TestCase
from rest_framework import status

from ..models import *
from .utils import *

User: AbstractBaseUser = get_user_model()


class UserTestCase(TestCase):
    def test_createuser(self):
        self.assertEqual(UserManager, type(User.objects))
        u1 = User.objects.create_user(username="abc", password="1234")
        client = Client()
        self.assertTrue(client.login(username="abc", password="1234"))
        self.assertFalse(client.login(username="abc", password="12345"))
        self.assertFalse(client.login(username="abcd", password="1234"))

        self.assertRaises(ValueError, User.objects.create_user, username=None)
        self.assertRaises(TypeError, User.objects.create_user, username=b"123")
        self.assertRaises(
            TypeError, User.objects.create_user, username="abc", password=b"123"
        )


# Create your tests here.
class AuthTestCase(TestCase):
    def setUp(self):
        u1 = User.objects.create_user(username="abc", password="1234")
        u2 = User.objects.create_user(username="pqr", password="3456")
        self.u1 = u1
        self.u2 = u2
        self.client = Client(enforce_csrf_checks=True)

    def test_signin(self):
        headers1 = {"HTTP_AUTHORIZATION": basic_auth_encoder("abc", "1234")}
        headers2 = {"HTTP_AUTHORIZATION": basic_auth_encoder("pqr", "1234")}

        response = self.client.get("/api/token/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        token = response.cookies["csrftoken"].value

        response = self.client.post("/api/signin/", HTTP_X_CSRFTOKEN=token, **headers2)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.post("/api/signin/", HTTP_X_CSRFTOKEN=token, **headers1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get("/api/check/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["logged_in"], True)

        response = self.client.get("/api/signout/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        response = self.client.get("/api/check/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["logged_in"], False)
