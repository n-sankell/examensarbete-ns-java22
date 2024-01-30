FROM openapitools/openapi-generator-cli:v7.2.0 AS openapi-generator

WORKDIR /abc

COPY ./spring-boot-app/src/main/resources/openapi.yaml ./openapi.yaml

ARG ADDRESS=localhost:8080

ENV ADDRESS_B=${ADDRESS}

RUN java -jar /opt/openapi-generator/modules/openapi-generator-cli/target/openapi-generator-cli.jar generate -i ./openapi.yaml -g typescript-fetch -o  ./generated --additional-properties redux=true --server-variables=address=${ADDRESS}

RUN mkdir -p /abc/generated/confirm-generated-folder

FROM node:20-slim AS builder

WORKDIR /app/react-app

COPY ./react-app/ .

RUN rm -rf ./src/generated
RUN rm -rf ./src/generated

COPY --from=openapi-generator /abc/generated ./src/generated

RUN yarn cache clean --force
RUN rm -rf node_modules yarn.lock
RUN yarn install
RUN yarn build

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/react-app/build /app/build

RUN npm install -g serve

EXPOSE 3000

CMD serve -s build -l 3000