import 'dotenv/config'; // dotenv 모듈을 가지고 오는 동시에 config() 함수도 자동으로 호출한다

export const SERVER_PORT = process.env.SERVER_PORT;
// .env 파일에 저장된 SERVER_PORT 값을 가지고 와서 SERVER_PORT 변수에 대입한다
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
// .env 파일에 저장된 ACCESS_TOKEN_SECRET 값을 가지고 와서 ACCESS_TOKEN_SECRET 변수에 대입한다
