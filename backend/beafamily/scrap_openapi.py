import requests
import os
import json
from sqlalchemy import create_engine

baseurl = "http://apis.data.go.kr/1543061/abandonmentPublicSrvc"
# key = os.environ.get("API_KEY")
with open("key", "r") as f:
    key = f.read().strip()


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
    url = f"{baseurl}/sigungu"
    params = {"serviceKey": key, "upr_cd": upr_cd, "org_cd": org_cd, "_type": "json"}
    response = requests.get(url, params=params)
    data = json.loads(response.content)
    if data["response"]["header"]["resultCode"] != "00":
        return None

    return data["response"]["body"]["items"]["item"]


def get_sigungu(upr_cd):
    # upr_cd = orgCd
    url = f"{baseurl}/sigungu"
    params = {"serviceKey": key, "upr_cd": upr_cd, "_type": "json"}

    response = requests.get(url, params=params)
    data = json.loads(response.content)
    if data["response"]["header"]["resultCode"] != "00":
        return None

    return data["response"]["body"]["items"]["item"]


def get_sido():
    url = f"{baseurl}/sido"
    params = {"serviceKey": key, "numOfRows": 30, "_type": "json"}
    response = requests.get(url, params=params)
    data = json.loads(response.content)
    if data["response"]["header"]["resultCode"] != "00":
        return None

    return data["response"]["body"]["items"]["item"]


def main():
    # info = get_info()
    # print(info[0])
    # with open("total.json", "w") as j:
    #     j.write(json.dumps(info))
    # sido_info = get_sido()
    #
    # if not sido_info:
    #     raise Exception()
    #
    # for city in sido_info:
    #     city_info = get_sigungu(city["orgCd"])
    #     if city_info is None:
    #         raise Exception()
    #
    #     for city in city_info:
    #         shelter_info = get_shelter(city["uprCd"], city["orgCd"])
    #
    #         if shelter_info is None:
    #             raise Exception()
    #
    #         for shelter in shelter_info:
    #             pass

    # import sqlite3
    # db = "db.sqlite3"
    #
    # conn = sqlite3.connect(db)
    # cur = conn.cursor()
    # cur.execute("SELECT title, content FROM post")
    # result = cur.fetchall()
    # print(result)
    engine = create_engine(r"sqlite:///db.sqlite3")
    conn = engine.connect()

    # GET ALL Data from shelter
    res = conn.execute(
        r"""SELECT title,content FROM post WHERE author_id IN (
    SELECT id FROM user WHERE shelter=false
    )"""
    ).fetchall()
    print(res)
    conn.close()


if __name__ == "__main__":
    # psuedo_code:
    # 1. get info and parse data
    # 2. create user if db has no user info on shelter
    # 3. load db data from shelter
    # 4. if in db but not in response -> remove
    # 5. if both in -> update date
    # 6. if in response but not db -> insert
    # optional. parallelize it
    main()
