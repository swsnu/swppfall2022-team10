#!/bin/bash


pip install -r requirements.txt
mkdir -p logs

./cleanup_db.sh

ret=$?
if [ $ret -ne 0 ]
then 
    echo "ERROR happened"
    rm db.sqlite3
    ./cleanup_db.sh
fi

(echo "Y" && echo "d" && echo "100") | ./create_dummy.py
