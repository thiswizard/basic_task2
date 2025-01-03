// express 모듈에서 express 기능을 가지고온다
import express from 'express'; 
// env.constant.js 에서 SERVER_PORT 라는 값을 그대로 가지고 온다
import { SERVER_PORT } from './constants/env.constant.js'; 
// error-handler.middleware.js 에서 errorHandler 라는 값을 그대로 가지고 온다
import { errorHandler } from './middlewares/error-handler.middleware.js';
// http-status.constant.js 에서 HTTP_STATUS 라는 값을 그대로 가지고 온다
import { HTTP_STATUS } from './constants/http-status.constant.js';
// index.js 에서 apiRouter 라는 값을 그대로 가지고 온다
import { apiRouter } from './routers/index.js';

const app = express(); // express 애플리케이션 을 생성해서 app 변수에 저장

app.use(express.json()); // express 애플리케이션에 JSON 파싱 미들웨어를 등록
app.use(express.urlencoded({ extended: true })); // express 애플리케이션에 urlencoded 파싱 미들웨어를 등록

app.get('/health-check', (req, res) => {
  return res.status(HTTP_STATUS.OK).send(`I'm healthy.`);
}); 
// /health-check 경로에 요청이 들어오면 HTTP 상태 코드와 함께 문자열 응답을 반환함

app.use('/api', apiRouter);  // api 경로에 들어오는 요청을 apiRouter 에서 처리한다

app.use(errorHandler); // 에러처리 미들웨어를 등록한다

app.listen(SERVER_PORT, () => {
  console.log(`서버가 ${SERVER_PORT}번 포트에서 실행 중입니다.`);
}); 
// express 애플리케이션을 SERVER_PORT 지정된 포트를 통해 실행한다
