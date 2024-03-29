FROM maven:3.9.6-amazoncorretto-17-debian AS build

ARG BACKEND_API
ARG GOOGLE_CLIENT_ID

ENV REACT_APP_API_PATH $BACKEND_API
ENV REACT_APP_OAUTH2_GOOGLE_CLIENT_ID $GOOGLE_CLIENT_ID

COPY pom.xml /home/app/pom.xml
COPY kpoint-back/pom.xml /home/app/kpoint-back/pom.xml
COPY kpoint-react/pom.xml /home/app/kpoint-react/pom.xml
RUN mvn -f /home/app/pom.xml dependency:go-offline

COPY kpoint-back/src /home/app/kpoint-back/src
COPY kpoint-react/src /home/app/kpoint-react/src
COPY kpoint-react/package.json /home/app/kpoint-react/package.json
COPY kpoint-react/public /home/app/kpoint-react/public
COPY kpoint-react/.eslintrc /home/app/kpoint-react/.eslintrc
COPY kpoint-react/tsconfig.json /home/app/kpoint-react/tsconfig.json
COPY kpoint-back/checkstyle.xml /home/app/kpoint-back/checkstyle.xml
RUN mvn -f /home/app/pom.xml clean package -Dmaven.test.skip

FROM amazoncorretto:17

RUN mkdir /app
WORKDIR /app
COPY --from=build /home/app/target/*.jar /app/api.jar

CMD ["java", "-jar", "/app/api.jar"]