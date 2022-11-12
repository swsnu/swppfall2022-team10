import base64

import django.contrib.auth.models
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from . import views
from .models import Post, Review, Photo, post_serializer, review_serializer
from .views.utils import HttpStatus
from PIL import Image
import json

User: django.contrib.auth.models.AbstractUser = get_user_model()


# Create your tests here.
class AuthTestCase(TestCase):
    def setUp(self):
        u1 = User.objects.create(
            username="abc"
        )
        u1.set_password("1234")
        u1.save()
        u2 = User.objects.create(
            username="pqr"
        )
        u2.set_password("3456")
        u2.save()
        self.u1 = u1
        self.u2 = u2
        self.client = Client(enforce_csrf_checks=True)

    def test_signin(self):
        encoded1 = base64.b64encode(b'abc:1234').decode("ascii")
        encoded2 = base64.b64encode(b'pqr:1234').decode("ascii")
        headers1 = {
            "HTTP_AUTHORIZATION": 'Basic ' + encoded1
        }
        headers2 = {
            "HTTP_AUTHORIZATION": 'Basic ' + encoded2
        }

        response = self.client.get("/api/token/")
        self.assertEqual(response.status_code, HttpStatus.NO_CONTENT)
        token = response.cookies['csrftoken'].value

        response = self.client.post("/api/signin/",
                                    HTTP_X_CSRFTOKEN=token,
                                    **headers2)
        self.assertEqual(response.status_code, HttpStatus.UNAUTHORIZED)

        response = self.client.post("/api/signin/",
                                    HTTP_X_CSRFTOKEN=token,
                                    **headers1)
        self.assertEqual(response.status_code, HttpStatus.OK)

        response = self.client.get("/api/check/")
        self.assertEqual(response.status_code, HttpStatus.OK)
        data = response.json()
        self.assertEqual(data['logged_in'], True)

        response = self.client.get("/api/signout/")
        self.assertEqual(response.status_code, HttpStatus.NO_CONTENT)

        response = self.client.get("/api/check/")
        self.assertEqual(response.status_code, HttpStatus.OK)
        data = response.json()
        self.assertEqual(data['logged_in'], False)


class PostTestCase(TestCase):

    def setUp(self):
        u1 = User.objects.create(
            username="abc"
        )
        u1.set_password("1234")
        u1.save()
        u2 = User.objects.create(
            username="pqr"
        )
        u2.set_password("3456")
        u2.save()
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
            content={
                "text": "bbb"
            }
        )
        photo1 = Photo.objects.create(
            image="dummy/cat_dummy/cat2.jpg",
            category="post_test",
            number=p1.id,
            user=u1
        )

        photo2 = Photo.objects.create(
            image="dummy/cat_dummy/cat1.jpg",
            category="post_test",
            number=p1.id,
            user=u1
        )
        p1.content["photo_list"] = [photo1.id, photo2.id]
        p1.save()
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
            content={
                "text": "bbb"
            }
        )
        photo3 = Photo.objects.create(
            image="dummy/dog_dummy/dog.jpeg",
            category="post_test",
            number=p2.id,
            user=u2
        )

        photo4 = Photo.objects.create(
            image="dummy/dog_dummy/golden-retriever.webp",
            category="post_test",
            number=p2.id,
            user=u2
        )
        p2.content["photo_list"] = [photo3.id, photo4.id]
        p2.save()
        self.p1 = p1
        self.p2 = p2
        self.client = Client(enforce_csrf_checks=True)

    def test_post(self):
        response = self.client.get("/api/posts/")
        self.assertEqual(response.status_code, HttpStatus.OK)
        data = response.json()
        p1 = post_serializer(self.p1)
        p2 = post_serializer(self.p2)
        self.assertEqual(data, [p2, p1])

        response = self.client.get("/api/posts/1/")
        self.assertEqual(response.status_code, HttpStatus.OK)
        data = response.json()
        self.assertEqual(data, p1)

        response = self.client.get("/api/posts/11/")
        self.assertEqual(response.status_code, HttpStatus.NOT_FOUND)

    def test_deletepost(self):
        # response = self.client.delete("/api/posts/1/")
        # self.assertEqual(response.status_code, HttpStatus.FORBIDDEN)
        response = self.client.get("/api/token/")
        token = response.cookies['csrftoken'].value

        # response = self.client.delete("/api/posts/1/", HTTP_X_CSRFTOKEN=token)
        # self.assertEqual(response.status_code, HttpStatus.UNAUTHORIZED)

        response = self.client.post("/api/signin/",
                                    HTTP_X_CSRFTOKEN=token,
                                    HTTP_AUTHORIZATION="Basic " + base64.b64encode(b"abc:1234").decode()
                                    )

        token = response.cookies['csrftoken'].value
        # self.assertEqual(response.status_code, HttpStatus.OK)

        response = self.client.delete("/api/posts/1/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, HttpStatus.OK)

        response = self.client.get("/api/posts/1/")
        self.assertEqual(response.status_code, HttpStatus.NOT_FOUND)

        response = self.client.delete("/api/posts/2/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, HttpStatus.FORBIDDEN)

        response = self.client.delete("/api/posts/12/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, HttpStatus.NOT_FOUND)

        # response = self.client.patch("/api/posts/1/", HTTP_X_CSRFTOKEN=token)
        # self.assertEqual(response.status_code, HttpStatus.NOT_ALLOWED)

    def test_putpost(self):
        # response = self.client.put("/api/posts/1/")
        # self.assertEqual(response.status_code, HttpStatus.FORBIDDEN)
        response = self.client.get("/api/token/")
        token = response.cookies['csrftoken'].value

        response = self.client.post("/api/signin/",
                                    HTTP_X_CSRFTOKEN=token,
                                    HTTP_AUTHORIZATION="Basic " + base64.b64encode(b"abc:1234").decode()
                                    )

        token = response.cookies['csrftoken'].value
        # self.assertEqual(response.status_code, HttpStatus.OK)

        response = self.client.put("/api/posts/1/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, HttpStatus.OK)

        response = self.client.put("/api/posts/2/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, HttpStatus.FORBIDDEN)

        response = self.client.put("/api/posts/12/", HTTP_X_CSRFTOKEN=token)
        self.assertEqual(response.status_code, HttpStatus.NOT_FOUND)

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
            "content": "text"
        }

        response = self.client.get("/api/token/")
        token = response.cookies["csrftoken"].value

        response = self.client.post("/api/signin/",
                                    HTTP_X_CSRFTOKEN=token,
                                    HTTP_AUTHORIZATION="Basic " + base64.b64encode(b"abc:1234").decode()
                                    )
        token = response.cookies["csrftoken"].value

        with open("dummy/post/cat_dummy/cat2.jpg", "rb") as f:
            # img = Image.open("dummy/post/cat_dummy/cat2.jpg")
            response = self.client.post("/api/posts/",
                                        data={
                                            "photos": [],
                                            "content": json.dumps(newpost)
                                        },
                                        HTTP_X_CSRFTOKEN=token)

            self.assertEqual(response.status_code, HttpStatus.BAD_REQUEST)

        with open("dummy/post/cat_dummy/cat2.jpg", "rb") as f:
            # img = Image.open("dummy/post/cat_dummy/cat2.jpg")
            response = self.client.post("/api/posts/",
                                        data={
                                            "photos": [f],
                                            "content": [newpost, newpost]
                                        },
                                        HTTP_X_CSRFTOKEN=token)

            self.assertEqual(response.status_code, HttpStatus.BAD_REQUEST)

        with open("dummy/post/cat_dummy/cat2.jpg", "rb") as f:
            # img = Image.open("dummy/post/cat_dummy/cat2.jpg")
            response = self.client.post("/api/posts/",
                                        data={
                                            "photos": [f],
                                            "content": newpost,
                                            "extra": {
                                                "dummy": "dummy"
                                            }
                                        },
                                        HTTP_X_CSRFTOKEN=token)

            self.assertEqual(response.status_code, HttpStatus.BAD_REQUEST)

        with open("dummy/post/cat_dummy/cat2.jpg", "rb") as f:
            # img = Image.open("dummy/post/cat_dummy/cat2.jpg")
            response = self.client.post("/api/posts/",
                                        data={
                                            "photos": [f, ],
                                            "content": json.dumps(newpost)
                                        },
                                        HTTP_X_CSRFTOKEN=token)

            self.assertEqual(response.status_code, HttpStatus.CREATED)


class ReviewTestCase(TestCase):
    def setUp(self):
        u1 = User.objects.create(
            username="abc"
        )
        u1.set_password("1234")
        u1.save()
        u2 = User.objects.create(
            username="pqr"
        )
        u2.set_password("3456")
        u2.save()
        r1 = Review.objects.create(
            author=u1,
            title="title",
            content={
                "text": "content"
            }
        )
        photo1 = Photo.objects.create(
            image="dummy/cat_dummy/cat2.jpg",
            category="review_test",
            number=r1.id,
            user=u1
        )

        photo2 = Photo.objects.create(
            image="dummy/cat_dummy/cat1.jpg",
            category="review_test",
            number=r1.id,
            user=u1
        )
        r1.content["photo_list"] = [photo1.id, photo2.id]
        r1.save()

        r2 = Review.objects.create(
            author=u2,
            title="title",
            content={
                "text": "content"
            }
        )
        photo3 = Photo.objects.create(
            image="dummy/dog_dummy/dog.jpeg",
            category="review_test",
            number=r2.id,
            user=u2
        )

        photo4 = Photo.objects.create(
            image="dummy/dog_dummy/golden-retriever.webp",
            category="review_test",
            number=r2.id,
            user=u2
        )
        r2.content["photo_list"] = [photo3.id, photo4.id]
        r2.save()
        self.u1 = u1
        self.u2 = u2
        self.r1 = r1
        self.r2 = r2
        self.client = Client(enforce_csrf_checks=True)

    def test_getreview(self):
        response = self.client.get("/api/reviews/")
        self.assertEqual(response.status_code, HttpStatus.OK)
        r1 = review_serializer(self.r1)
        r2 = review_serializer(self.r2)
        self.assertEqual(response.json(), [r2, r1])

        response = self.client.get("/api/reviews/1/")
        self.assertEqual(response.status_code, HttpStatus.OK)
        self.assertEqual(response.json(), r1)

        response = self.client.get("/api/reviews/11/")
        self.assertEqual(response.status_code, HttpStatus.NOT_FOUND)

    def test_createreview(self):
        response = self.client.get("/api/token/")
        self.assertEqual(response.status_code, HttpStatus.NO_CONTENT)
        token = response.cookies["csrftoken"].value
        response = self.client.post("/api/signin/",
                                    HTTP_AUTHORIZATION="Basic " + base64.b64encode(b"abc:1234").decode(),
                                    HTTP_X_CSRFTOKEN=token
                                    )
        self.assertEqual(response.status_code, HttpStatus.OK)
        token = response.cookies["csrftoken"].value

        newreview = {
            "title": "abc",
            "content": "xyz"
        }
        with open("dummy/review/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/reviews/",
                data = {
                    "content": json.dumps(newreview),
                    "photos": [f, ],
                    "dummy": {
                        "dummy": "dummy"
                    }
                },
                HTTP_X_CSRFTOKEN=token
            )
            self.assertEqual(response.status_code, HttpStatus.BAD_REQUEST)

        with open("dummy/review/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/reviews/",
                data = {
                    "content": [json.dumps(newreview), json.dumps(newreview)],
                    "photos": [f, ]
                },
                HTTP_X_CSRFTOKEN=token
            )
            self.assertEqual(response.status_code, HttpStatus.BAD_REQUEST)

        with open("dummy/review/cat_dummy/info.json", "rb") as f:
            response = self.client.post(
                "/api/reviews/",
                data = {
                    "content": json.dumps(newreview),
                    "photos": [f, ]
                },
                HTTP_X_CSRFTOKEN=token
            )
            self.assertEqual(response.status_code, HttpStatus.BAD_REQUEST)
        with open("dummy/review/cat_dummy/cat2.jpg", "rb") as f:
            response = self.client.post(
                "/api/reviews/",
                data = {
                    "content": json.dumps(newreview),
                    "photos": [f, ]
                },
                HTTP_X_CSRFTOKEN=token
            )
            self.assertEqual(response.status_code, HttpStatus.CREATED)
