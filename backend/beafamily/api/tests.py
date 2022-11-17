import base64

import django.contrib.auth.models
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import *
from rest_framework import status
import json

User: django.contrib.auth.models.AbstractUser = get_user_model()


def basic_auth_encoder(username, password):
    return "Basic " + base64.b64encode(f"{username}:{password}".encode()).decode()


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


class PostTestCase(TestCase):
    def setUp(self):
        u1 = User.objects.create_user(username="abc", password="1234")
        u2 = User.objects.create_user(username="pqr", password="3456")
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

    def test_post(self):
        response = self.client.get("/api/posts/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        p1 = post_serializer(self.p1)
        p2 = post_serializer(self.p2)
        self.assertEqual(data, [p2, p1])

        response = self.client.get("/api/posts/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data, p1)

        response = self.client.get("/api/posts/11/")
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

        response = self.client.delete("/api/posts/12/", HTTP_X_CSRFTOKEN=token)
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

        response = self.client.put("/api/posts/12/", HTTP_X_CSRFTOKEN=token)
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
                    "content": json.dumps(newpost),
                    "dummy": {"dummy": "dummy"},
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


class ReviewTestCase(TestCase):
    def setUp(self):
        u1 = User.objects.create_user(username="abc", password="1234")
        u2 = User.objects.create_user(username="pqr", password="3456")
        r1 = Review.objects.create(author=u1, title="title", content="content")
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

        r2 = Review.objects.create(author=u2, title="title", content="content")
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
        r1 = review_serializer(self.r1)
        r2 = review_serializer(self.r2)
        self.assertEqual(response.json(), [r2, r1])

        response = self.client.get("/api/reviews/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), r1)

        response = self.client.get("/api/reviews/11/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

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

        newreview = {"title": "abc", "content": "xyz"}
        with open("dummy/review/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/reviews/",
                data={
                    "content": json.dumps(newreview),
                    "photos": [
                        f,
                    ],
                    "dummy": {"dummy": "dummy"},
                },
                HTTP_X_CSRFTOKEN=token,
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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
                    "content": json.dumps(newreview),
                    "photos": [
                        f,
                    ],
                    "dummy": {"dummy": "dummy"},
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
                    "dummy": {"dummy": "dummy"},
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
