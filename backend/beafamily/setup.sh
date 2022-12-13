#!/bin/bash


pip install -r requirements.txt
mkdir -p logs

./cleanup_db.sh
./create_dummy.py
./scrap_openapi.py
