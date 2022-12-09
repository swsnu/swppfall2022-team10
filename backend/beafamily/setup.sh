#!/bin/bash


pip install -r requirements.txt
mkdir -p logs
rm db.sqlite3

./cleanup_db.sh


(echo "Y" && echo "d" && echo "100") | ./create_dummy.py
