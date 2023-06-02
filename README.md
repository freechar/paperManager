# README 

# PaperManager

A web App can manage paper

# Run

```shell
cd backend
go run main.go
```

```shell
cd front
npm start
```
```shell
# docker部署依赖
#!/bin/bash
docker run --name mariadb -p 3306:3306  -e MYSQL_ROOT_PASSWORD=123456 -d mariadb
docker run -i -t -d -p 80:80 --restart=always -e JWT_ENABLED=false onlyoffice/documentserver
```
