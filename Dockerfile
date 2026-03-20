FROM mcr.microsoft.com/playwright:v1.51.0-jammy

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npx playwright install chromium firefox --with-deps

RUN npm install -g allure

# CMD ["npx", "playwright", "test"]