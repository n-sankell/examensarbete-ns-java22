FROM postgres:16.1

ENV PGPORT 5434
ENV PGDATABASE userdb
ENV PGUSER useruser
ENV PGPASSWORD userpass

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5434
