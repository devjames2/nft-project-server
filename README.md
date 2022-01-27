
# Run for local test with Docker

## pre-requisite
```
docker, docker-compose
```

.dev.env 파일에 아래 정보 추가 필요. 내용은 influence/slack에 공유
```
MONGO_URL = ""
PORT = 
MORALIS_SERVER = ""
MORALIS_APP_ID = ""
JWT_SECRET = ""
```

## Running the app with docker-compose
```
## docker build
$ docker build -t nft-project-server:{tag} .

## tag명에 맞춰 docker-compose.yml 수정 && mongodb 저장 위치 수정

## docker-compose 실행
$ docker-compose up
```

---
# Setting for dev

```
## install nodejs v12.18.4
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install v12.18.4   

## install package
cd nft-project-server
npm install
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```