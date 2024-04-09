#！/bin/bash

git pull origin master

python3.7 unique.py

git add .

git commit -m "Auto commit by script"

git push origin master
