FROM eclipse-temurin:19 AS build-stage

COPY . .

RUN ls .

RUN chmod +x /gradlew

RUN ./gradlew build --no-daemon -x test
RUN rm /build/build/libs/*-plain.jar

FROM eclipse-temurin:19-jre-alpine
WORKDIR /app

COPY --from=build-stage /build/libs/*.jar /app/resp.jar

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "resp.jar", "-Djava.net.preferIPv4Stack=true"]
