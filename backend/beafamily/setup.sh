#!/bin/bash


pip install -r requirements.txt
./cleanup_db.sh
./create_dummy.py
