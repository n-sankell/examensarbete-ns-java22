FROM openapitools/openapi-generator-cli:v7.2.0 AS openapi-generator

WORKDIR /abc

COPY ./midi-manager/src/main/resources/midi-manager-api.yaml ./midi-manager-api.yaml
COPY ./user-service/src/main/resources/user-service-api.yaml ./user-service-api.yaml

ARG MIDI_ADDRESS=localhost:8082
ARG USER_ADDRESS=localhost:8081

ENV ADDRESS_B=${MIDI_ADDRESS}
ENV ADDRESS_C=${USER_ADDRESS}

RUN java -jar /opt/openapi-generator/modules/openapi-generator-cli/target/openapi-generator-cli.jar generate -i ./midi-manager-api.yaml -g typescript-fetch -o  ./generated/midi-api --additional-properties redux=true --server-variables=address=${MIDI_ADDRESS}

RUN java -jar /opt/openapi-generator/modules/openapi-generator-cli/target/openapi-generator-cli.jar generate -i ./user-service-api.yaml -g typescript-fetch -o  ./generated/user-api --additional-properties redux=true --server-variables=address=${USER_ADDRESS}

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