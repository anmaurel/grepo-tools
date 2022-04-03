FROM alpine

RUN ping 8.8.8.8
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

EXPOSE 9000

CMD ["npm run start"]