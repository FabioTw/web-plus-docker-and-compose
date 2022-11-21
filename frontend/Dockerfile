FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN npm i

COPY . .
RUN npm run build

FROM nginx:1.23.1-alpine as production

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build ./usr/share/nginx/html
COPY /nginx/conf.d /etc/nginx/conf.d

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
