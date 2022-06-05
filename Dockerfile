FROM node:alpine

RUN mkdir -p /usr/src/bot
COPY . /usr/src/bot

WORKDIR /usr/src/bot

RUN yarn install --production

CMD ["node", "app.js"]
EXPOSE 8080
