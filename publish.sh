#！/bin/bash

git pull origin master

python3.7 unique.py

git config  --global user.email  "youzel@126.com"

git add .

git commit -m "Auto commit by script"

git push origin master

git config  --global user.email  "liangyouze@tal.com"