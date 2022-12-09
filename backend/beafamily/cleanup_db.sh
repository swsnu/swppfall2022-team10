#!/bin/bash


rm db.sqlite3
rm -f api/migrations/000*.py
rm -rf data/*
cp -r dummy data

python manage.py makemigrations
python manage.py migrate
