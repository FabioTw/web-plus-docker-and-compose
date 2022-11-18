FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN npm i

COPY . .
RUN npm run build
RUN npm install pm2 -g 

FROM node:16-alpine as production
WORKDIR /app
COPY --from=builder /app/package*.json ./

RUN npm i --omit=dev 

COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js

EXPOSE 3032

CMD ["pm2-runtime", "start", "ecosystem.config.js"] 