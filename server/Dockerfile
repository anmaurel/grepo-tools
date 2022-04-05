FROM mhart/alpine-node:16.4

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      npm

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

CMD [ "node", "--experimental-specifier-resolution=node", "app.js" ]