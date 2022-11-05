FROM alpine:latest

RUN apk add --update --no-cache nodejs npm tzdata
RUN npm i -g pm2
ENV TZ=Asia/Bangkok
WORKDIR /source
ENTRYPOINT './start.sh'
