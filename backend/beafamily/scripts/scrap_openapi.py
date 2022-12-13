#!/usr/bin/env python
import requests
import os
import json
from django.utils import timezone
from hashlib import sha1
from tqdm import tqdm
from django.contrib.auth.hashers import make_password
from django.conf import settings
from django.contrib.auth import get_user_model
from api.models import Post

User = get_user_model()
local = False

import re

try:
    key = settings.API_KEY
except:
    with open(settings.BASE_DIR / "scrapping_data" / "key", "r") as f:
        key = f.read().strip()
    local = True

baseurl = "http://apis.data.go.kr/1543061/abandonmentPublicSrvc"


def get_info():
    total = list()
    url = f"{baseurl}/abandonmentPublic"
    params = {"serviceKey": key, "numOfRows": 1000, "_type": "json"}
    response = requests.get(url, params=params)
    data = json.loads(response.content)
    if data["response"]["header"]["resultCode"] != "00":
        return None

    n = int(data["response"]["body"]["totalCount"])

    num_pages = n // 1000 + 1
    total += data["response"]["body"]["items"]["item"]

    for i in range(2, num_pages + 1):
        params = {"serviceKey": key, "numOfRows": 1000, "_type": "json", "pageNo": i}
        response = requests.get(url, params=params)
        data = json.loads(response.content)
        if data["response"]["header"]["resultCode"] != "00":
            continue
        total += data["response"]["body"]["items"]["item"]

    return total


def get_shelter(upr_cd, org_cd):
    url = f"{baseurl}/shelter"
    params = {"serviceKey": key, "upr_cd": upr_cd, "org_cd": org_cd, "_type": "json"}
    response = requests.get(url, params=params)
    try:
        data = json.loads(response.content)
    except:
        return []
    if data["response"]["header"]["resultCode"] != "00":
        return None

    if "item" in data["response"]["body"]["items"]:
        return data["response"]["body"]["items"]["item"]
    else:
        return []


def get_sigungu(upr_cd):
    # upr_cd = orgCd
    url = f"{baseurl}/sigungu"
    params = {"serviceKey": key, "upr_cd": upr_cd, "_type": "json"}

    response = requests.get(url, params=params)
    try:
        data = json.loads(response.content)
    except:
        return []
    if data["response"]["header"]["resultCode"] != "00":
        return None

    if "item" in data["response"]["body"]["items"]:
        return data["response"]["body"]["items"]["item"]
    else:
        return []


def get_sido():
    url = f"{baseurl}/sido"
    params = {"serviceKey": key, "numOfRows": 30, "_type": "json"}
    response = requests.get(url, params=params)
    try:
        data = json.loads(response.content)
    except:
        return []
    if data["response"]["header"]["resultCode"] != "00":
        return None

    return data["response"]["body"]["items"]["item"]


def get_datetime(s):
    year = int(s[0:4])
    month = int(s[4:6])
    day = int(s[6:8])
    return timezone.datetime(year, month, day)


def create_shelter_user():
    shelter_list = User.objects.filter(shelter=True)

    if not shelter_list.filter(username="default_shelter").exists():
        User.objects.create_user(
            username="default_shelter",
            nickname="default_shelter",
            password="default_shelter",
            shelter=True,
            address="Unknown",
        )

    users = []
    # with open(settings.BASE_DIR / "scrapping_data" / "users_hashed.json", "r") as f:
    #     users = json.loads(f.read())

    # users = [
    #     User(
    #         username=u["username"],
    #         password=u["hashed"],
    #         nickname=u["nickname"],
    #         address=u["address"],
    #         shelter=True
    #     )
    #     for u in users
    # ]
    region_info = get_sido()
    if not region_info:
        raise Exception()
    for region in region_info:
        city_info = get_sigungu(region["orgCd"])
        if city_info is None:
            raise Exception()

        for city in city_info:
            shelter_info = get_shelter(city["uprCd"], city["orgCd"])

            if shelter_info is None:
                raise Exception()

            for shelter in shelter_info:
                if not shelter_list.filter(username=shelter["careRegNo"]).exists():
                    password = sha1(shelter["careRegNo"].encode()).hexdigest()
                    username = shelter["careRegNo"]
                    nickname = shelter["careNm"]
                    address = (
                        f"{region['orgdownNm']} {city['orgdownNm']} {shelter['careNm']}"
                    )
                    # users.append(
                    #     {
                    #         "username": username,
                    #         "nickname": nickname,
                    #         "address": address,
                    #         "password": make_password(password),
                    #         "shelter": True
                    #     }
                    # )
                    users.append(
                        User(
                            username=username,
                            nickname=nickname,
                            address=address,
                            password=make_password(password),
                            shelter=True,
                        )
                    )

    User.objects.bulk_create(users)


def fetch_posts():
    info = get_info()

    return info


def main():
    create_shelter_user()
    data = fetch_posts()

    shelter_posts = Post.objects.filter(shelter=True)

    today = timezone.now().date()
    date_over = shelter_posts.filter(end_date__lt=today)
    date_over.delete()

    ended = [i for i in data if i["processState"] != "보호중"]
    ended_ids = [int(i["desertionNo"]) for i in data]
    ended = shelter_posts.filter(desertionNo__in=ended_ids)
    ended.delete()

    valid = [i for i in data if i["processState"] == "보호중"]
    valid_ids = [int(i["desertionNo"]) for i in valid]

    valid_key_map = dict()
    for i, v in enumerate(valid):
        valid_key_map[int(v["desertionNo"])] = v

    print(shelter_posts.values("desertionNo"))
    valid_ids_in_db = set(shelter_posts.values("desertionNo"))

    notin_ids = list(set(valid_ids) - valid_ids_in_db)

    new_posts_info = [valid_key_map[key] for key in notin_ids]
    new_posts = []

    u = User.objects.filter(shelter=True)

    pattern = re.compile(r"(\[.+\])")
    for post_info in tqdm(new_posts_info):
        kind_str = post_info["kindCd"]
        animal_type = pattern.match(kind_str).group(1)[1:-1]
        species = pattern.sub("", kind_str).strip()
        if species == "":
            species = "기타"
        neutering = post_info["neuterYn"] == "Y"
        image_url = post_info["popfile"]
        gender = post_info["sexCd"] == "M"
        vaccination = False

        if animal_type == "개":
            form = "dog_form.docx"
        elif animal_type == "고양이":
            form = "cat_form.docx"
        else:
            form = "etc_form.docx"

        try:
            author: User = u.filter(nickname=post_info["careNm"])[0]
        except:
            author: User = User.objects.create_user(
                username=post_info["careNm"],
                nickname=post_info["careNm"],
                password=sha1(post_info["careNm"].encode()).hexdigest(),
                shelter=True,
                address=f"{post_info['careAddr']}{post_info['careNm']}",
            )

        noticeSdt = get_datetime(post_info["noticeSdt"])
        noticeEdt = get_datetime(post_info["noticeEdt"])
        happenDt = get_datetime(post_info["happenDt"])

        content = (
            f"동물: {animal_type}\n"
            f"품종: {species}\n"
            f"색상: {post_info['colorCd']}\n"
            f"주소: {author.address}\n"
            f"나이: {post_info['age']}\n"
            f"무게: {post_info['weight']}\n"
            f"연락처: {post_info['careTel']}\n"
            f"공고일시: {noticeSdt}\n"
            f"공고마감일시: {noticeEdt}\n"
            f"발견장소: {post_info['happenPlace']}\n"
            f"발견일시: {happenDt}\n"
            f"참고사항: {post_info['specialMark']}\n"
        )

        try:
            age = 2022 - int(post_info["age"][0:4])
            if age < 0 or age > 500:
                raise ValueError()
        except:
            age = 0
        new_info = Post(
            author=author,
            age=age,
            neutering=neutering,
            gender=gender,
            animal_type=animal_type,
            species=species,
            vaccination=False,
            content=content,
            created_at=noticeSdt,
            end_date=noticeEdt,
            is_active=True,
            form=form,
            name="보호소 동물",
            title="보호소 동물",
            shelter=True,
            thumbnail_url=image_url,
        )
        new_posts.append(new_info)

    Post.objects.bulk_create(new_posts)


# if __name__ == "__main__": main()
def run():
    main()
