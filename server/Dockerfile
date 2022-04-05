FROM mhart/alpine-node:latest

WORKDIR /app

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      npm

COPY package*.json ./

RUN npm i

COPY . .

CMD [ "node", "--experimental-specifier-resolution=node", "app.js" ]