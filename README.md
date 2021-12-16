# nft-project-server



Azure 가상머신 내 환경설정
```
## install nodejs v12.18.4
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install v12.18.4   

## install package
cd nft-project-server
npm install
npm install nodemon --save-dev


```

root에 .env 생성 후 아래 정보 추가 필요. 실제 내용은 influence에 공유
```
MONGO_URL = ""
PORT = 
MORALIS_SERVER = ""
MORALIS_APP_ID = ""
```