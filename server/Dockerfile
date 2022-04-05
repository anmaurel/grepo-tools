FROM node:17-alpine3.14

WORKDIR /app

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

RUN sysctl -w kernel.unprivileged_userns_clone=1

COPY package*.json ./

RUN npm i

COPY . .

CMD [ "node", "--experimental-specifier-resolution=node", "app.js" ]