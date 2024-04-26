FROM eclipse-temurin:21-jdk-alpine AS build-stage

WORKDIR /build

COPY ./gradle/ ./gradle/
COPY ./gradlew .
COPY ./settings.gradle .
COPY ./build.gradle .

RUN chmod +x gradlew
RUN dos2unix gradlew

RUN ./gradlew --version --no-daemon
RUN ./gradlew dependencies --no-daemon

COPY ./src/ ./src/

RUN ./gradlew clean
RUN ./gradlew openApiGenerate
RUN ./gradlew build --no-daemon -x test
RUN rm /build/build/libs/*-plain.jar

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build-stage /build/build/libs/*.jar /app/api.jar

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "api.jar", "-Djava.net.preferIPv4Stack=true"]