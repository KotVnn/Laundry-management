FROM alpine:latest

RUN apk add --update --no-cache nodejs npm
RUN npm i -g pm2
WORKDIR /source
ENTRYPOINT './start.sh'
