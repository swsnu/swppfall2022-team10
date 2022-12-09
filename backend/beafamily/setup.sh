#!/bin/bash


pip install -r requirements.txt
mkdir -p logs

./cleanup_db.sh


(echo "Y" && echo "d" && echo "100") | ./create_dummy.py
