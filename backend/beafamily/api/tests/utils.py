import base64
import random
import tqdm
import os

from api.models import *
from config.dev_settings import BASE_DIR, DATA_DIR
from django.utils import timezone
from string import ascii_letters


def basic_auth_encoder(username, password):
    return "Basic " + base64.b64encode(f"{username}:{password}".encode()).decode()
def get_random_review(animal_type):
    title = f"{animal_type}가 아주 귀여워요!"
    content = title
    delta = timezone.timedelta(random.randint(0, 10))

    return dict(title=title, content=content, created_at=timezone.now() - delta)


def get_random_post():
    names = ["해피", "나비"]
    delta = timezone.timedelta(random.randint(0, 10))
    age = random.randint(1, 25)
    len_contents = random.randint(30, 200)
    contents = "".join(random.choices(ascii_letters, k=len_contents))
    name = random.choice(names)
    animal_type = random.choice(["고양이", "개"])

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
        form = "dummy/post/dog_dummy/dog_form.docx"
    else:
        species = random.choice(cat_species)
        form = "dummy/post/cat_dummy/cat_form.docx"

    gender, vaccination, neutering = random.choices([True, False], k=3)

    return dict(
        animal_type=animal_type,
        neutering=neutering,
        vaccination=vaccination,
        age=age,
        name=name,
        gender=gender,
        species=species,
        title=f"{animal_type} {name} 입양하실 분 구해요",
        is_active=True,
        content=contents,
        created_at=timezone.now() - delta,
        form=form,
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


def create():
    n_post = 5

    if not os.path.exists(DATA_DIR):
        os.mkdir(DATA_DIR)
    if not os.path.exists(DATA_DIR / 'post'):
        os.mkdir(DATA_DIR / 'post')
    if not os.path.exists(DATA_DIR / 'application'):
        os.mkdir(DATA_DIR / 'application')
    if not os.path.exists(DATA_DIR / 'review'):
        os.mkdir(DATA_DIR / 'review')
    if not os.path.exists(DATA_DIR / 'question'):
        os.mkdir(DATA_DIR / 'question')

    users: list[User] = list(User.objects.all().iterator())
    cat_list = [
        "dummy/post/cat_dummy/cat.webp",
        "dummy/post/cat_dummy/cat2.jpg",
        "dummy/post/cat_dummy/cat3.jpg",
    ]
    dog_list = [
        "dummy/post/dog_dummy/dog.jpeg",
        "dummy/post/dog_dummy/golden-retriever.webp",
    ]

    for i in range(0, n_post):
        user = random.choice(users)

        data = get_random_post()

        post = Post.objects.create(author=user, **data)
        post.created_at = data["created_at"]

        animal_type = post.animal_type == "개"

        photos = dog_list if animal_type else cat_list
        post.thumbnail = photos[0]
        post.save()
        photos = [
            PostImage.objects.create(author=user, post=post, image=p)
            for p in photos
        ]
        num_comments = random.randint(0, 5)
        user_comment = random.choices(users, k=num_comments)
        comments = [
            PostComment.objects.create(author=u, content="comment", post=post)
            for u in user_comment
        ]

    is_actives = [True, True, False, False, False]
    posts = list(Post.objects.all().order_by('created_at').iterator())
    num_app = [0, 3, 2, 3, 3]
    for i in range(0, n_post):
        post = posts[i]
        user_excluded = set(users)
        user_excluded.discard(post.author)
        user_excluded = list(user_excluded)
        if post.id == n_post:
            user_excluded = [
                User.objects.get(username='yeomjy'),
                User.objects.get(username='lenyakim'),
                User.objects.get(username='jhpyun'),
            ]
        post.is_active = is_actives[i]
        post.save()
        num = num_app[i]

        if post.is_active:
            for j in range(0, num):
                user = user_excluded[j]
                data = Application.objects.create(
                    author=user, post=post, file="dummy/post/dog_dummy/dog_form.docx"
                )
        else:
            # Must have at least 1 application
            if num == 0:
                num = 1
                selected = random.randint(0, num-1)
            else:
                selected = random.randint(0, num)


            if post.id == n_post:
                selected = 0
            for j in range(0, num):
                user = user_excluded[j]
                data = Application.objects.create(
                    author=user, post=post, file="dummy/post/dog_dummy/dog_form.docx"
                )
                if post.id == n_post:
                    print(j, selected, user)
                if j == selected:
                    post.accepted_application = data
                    post.save()

    for i in range(n_post):
        if posts[i].is_active:
            continue
        if posts[i].id == n_post:
            continue
        animal_type = posts[i].animal_type
        data = get_random_review(animal_type)
        user = posts[i].accepted_application.author

        review = Review.objects.create(author=user, post=posts[i], animal_type=animal_type, **data)
        review.created_at = data["created_at"]

        photos = dog_list if animal_type == "개" else cat_list
        review.thumbnail = photos[0]
        review.save()
        photos = [
            ReviewImage.objects.create(author=user, review=review, image=p)
            for p in photos
        ]


def create_all():
    # n_review = len(Review.objects.all())
    # n_application = len(Application.objects.all())
    # n_question = len(Question.objects.all())
    # n_pimage = len(PostImage.objects.all())
    # n_rimage = len(ReviewImage.objects.all())
    # n_user = len(User.objects.all())


    usernames = ["yeomjy", "seorin55", "lenyakim", "jhpyun"]
    passwords = ["1q2w3e4r", "password", "12345678", "qwerty"]
    nicknames = ["염준영", "최서린", "김수빈", "편진희"]

    for un, pw, nn in zip(usernames, passwords, nicknames):
        u = User.objects.create_user(username=un, password=pw, nickname=nn)

    create()
    n_post = len(Post.objects.all())
