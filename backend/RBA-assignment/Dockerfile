#Build
FROM maven:3.9.7-amazoncorretto-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY .env .
RUN mvn clean package -DskipTests

#Run
FROM amazoncorretto:21
WORKDIR /app
COPY --from=build /app/target/*.jar ./app.jar
CMD ["java", "-jar", "app.jar"]