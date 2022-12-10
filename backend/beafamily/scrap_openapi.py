#!/usr/bin/env python
import requests
import os
import json
from sqlalchemy import create_engine
from django.utils import timezone
from django.db.models import ImageField
from hashlib import sha1
import datetime
from tqdm import tqdm
from django.contrib.auth.hashers import make_password
import sys

import re

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.dev_settings")
import django

django.setup()
from api.models import User, Post

GET_ALL = False

baseurl = "http://apis.data.go.kr/1543061/abandonmentPublicSrvc"
# key = os.environ.get("API_KEY")
with open("scrapping_data/key", "r") as f:
    key = f.read().strip()


def get_info(GET_ALL=False):
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

    if not GET_ALL:
        return total

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
    data = json.loads(response.content)
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
    data = json.loads(response.content)
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
    data = json.loads(response.content)
    if data["response"]["header"]["resultCode"] != "00":
        return None

    return data["response"]["body"]["items"]["item"]


def get_datetime(s):
    year = int(s[0:4])
    month = int(s[4:6])
    day = int(s[6:8])
    return timezone.datetime(year, month, day)


def create_shelter_user(GET_ALL=False):
    shelter_list = User.objects.filter(shelter=True)

    if not shelter_list.filter(username="default_shelter").exists():
        User.objects.create_user(
            username="default_shelter",
            nickname="default_shelter",
            password="default_shelter",
            shelter=True,
            address="Unknown",
        )

    count = 0
    count2 = 0
    users = []
    if not shelter_list.exclude(
        username="default_shelter"
    ).exists() and not os.path.exists("scrapping_data/users_hashed.json"):
        region_info = get_sido()
        if not region_info:
            raise Exception()
        for region in region_info:
            city_info = get_sigungu(region["orgCd"])
            if city_info is None:
                raise Exception()

            if not GET_ALL and count > 1:
                break

            for city in city_info:
                shelter_info = get_shelter(city["uprCd"], city["orgCd"])

                if shelter_info is None:
                    raise Exception()

                for shelter in shelter_info:
                    if not shelter_list.filter(username=shelter["careRegNo"]).exists():
                        password = sha1(shelter["careRegNo"].encode()).hexdigest()
                        username = shelter["careRegNo"]
                        nickname = shelter["careNm"]
                        address = f"{region['orgdownNm']} {city['orgdownNm']} {shelter['careNm']}"
                        users.append(
                            {
                                "username": username,
                                "nickname": nickname,
                                "address": address,
                                "hashed": make_password(password),
                            }
                        )

                        User.objects.create_user(
                            username=username,
                            password=password,
                            nickname=nickname,
                            address=address,
                            shelter=True,
                        )
                    count2 += 1
            count += 1
        with open("scrapping_data/users_hashed.json", "w") as j:
            j.write(json.dumps(users))
    elif not shelter_list.exclude(username="default_shelter").exists():
        with open("scrapping_data/users_hashed.json", "r") as j:
            users_data = json.loads(j.read())
        users = [
            User(
                username=user["username"],
                password=user["hashed"],
                nickname=user["nickname"],
                address=user["address"],
                shelter=True,
            )
            for user in tqdm(users_data)
        ]
        User.objects.bulk_create(users)
        # [User.objects.create_user(**user) for user in users]
    print(f"API CALL: {count2}")


def fetch_posts(GET_ALL=False):
    if not os.path.exists("scrapping_data/total.json"):
        info = get_info(GET_ALL)
        with open("scrapping_data/total.json", "w") as j:
            j.write(json.dumps(info))

    with open("scrapping_data/total.json", "r") as j:
        data = json.loads(j.read())
    return data


def main():
    GET_ALL = len(sys.argv) > 1 and sys.argv[1] == "--all"
    create_shelter_user(GET_ALL)
    data = fetch_posts(GET_ALL)

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

        try:
            author: User = u.get(nickname=post_info["careNm"])
        except:
            author: User = u.get(username="default_shelter")

        if not GET_ALL:
            if author.username == "default_shelter":
                continue

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
            form="dummy/post/dog_dummy/dog_form.docx",
            name="보호소 동물",
            title="보호소 동물",
            shelter=True,
            thumbnail_url=image_url,
        )
        new_posts.append(new_info)

    Post.objects.bulk_create(new_posts)

    # ids = [i['desertionNo'] for i in data]

    # today = timezone.localdate()


if __name__ == "__main__":
    main()
