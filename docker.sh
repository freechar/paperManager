#!/bin/bash
docker run --name mariadb -p 3306:3306  -e MYSQL_ROOT_PASSWORD=123456 -d mariadb
docker run -i -t -d -p 80:80 --restart=always -e JWT_ENABLED=false onlyoffice/documentserver
docker run -it -p 8081:8081 -v ./data:/root/data -d debian:stable-slim  /bin/bash

docker run -it -p 8081:8081 -v /path/to/docxBuilder:/root/docxBuilder -v /path/to/data:/root/docxBuilder/data himonoinu/python-docx-server-env:v0.1 python3 /root/docxBuilder/Http.py
