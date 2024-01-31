FROM mysql:8.2

ENV MYSQL_USER user
ENV MYSQL_PASSWORD password
ENV MYSQL_ROOT_PASSWORD root

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
