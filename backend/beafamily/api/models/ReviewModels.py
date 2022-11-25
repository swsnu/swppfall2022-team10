from django.db import models

from .AbstractTypes import AbstractArticleType, AbstractImageType


class Review(AbstractArticleType):
    animal_type = models.CharField(max_length=10)


def review_serializer(review: Review):
    photo_list = [p.image.url for p in review.photo_path.all()]

    response = {
        "author_id": review.author.id,
        "author_name": review.author.username,
        "id": review.id,
        "title": review.title,
        "photo_path": photo_list,
        "content": review.content,
    }
    return response


def review_image_upload_to(instance, filename):
    return f"review/{instance.review.id}/{filename}"


class ReviewImage(AbstractImageType):
    review = models.ForeignKey(
        Review, on_delete=models.CASCADE, related_name="photo_path"
    )
    image = models.ImageField(upload_to=review_image_upload_to)

    def __str__(self):
        return self.image.url
