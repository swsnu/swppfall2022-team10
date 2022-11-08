#!/bin/bash


echo "yes" | python manage.py flush
rm -f api/migrations/000*.py
rm -rf data/*

python manage.py makemigrations
python manage.py migrate
