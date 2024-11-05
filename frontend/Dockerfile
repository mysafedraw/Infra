# Node.js 20.18을 베이스 이미지로 사용합니다.
FROM node:20.18.0-alpine

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# package.json과 package-lock.json을 먼저 복사합니다.
COPY package*.json ./

# 의존성을 설치합니다.
RUN npm install

# 애플리케이션 코드를 복사합니다.
COPY . .

# Next.js 애플리케이션을 빌드합니다.
RUN npm run build

# 애플리케이션이 수신할 포트를 엽니다.
EXPOSE 3000

# 애플리케이션을 시작합니다.
CMD ["npm", "start"]