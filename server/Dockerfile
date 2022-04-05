FROM alpine:3.14

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

CMD ["npm run start"]