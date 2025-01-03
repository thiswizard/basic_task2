import express from 'express';
// express 모듈에서 express 기능을 가지고 옴
import { authRouter } from './auth.router.js';
// auth.router.js 에서 authRouter 값을 가지고  옴
import { usersRouter } from './users.router.js';
// users.router.js 에서 usersRouter 값을 가지고  옴
import { resumesRouter } from './resumes.router.js';
// resumes.router.js 에서 resumesRouter 값을 가지고  옴
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
// require-access-token.middleware.js 에서 requireAccessToken 값을 가지고  옴

const apiRouter = express.Router();
// express 에 새로운 라우터 객체를 생성해서 apiRouter 에 등록한다

apiRouter.use('/auth', authRouter);
// apiRouter 이름에 라우터에 /auth 경로에 들어오는 요청을 authRouter 에서 처리한다
apiRouter.use('/users', usersRouter);
// apiRouter 이름에 라우터에 /users 경로에 들어오는 요청을 usersRouter 에서 처리한다
apiRouter.use('/resumes', requireAccessToken, resumesRouter);
// apiRouter 이름에 라우터에 /resumes 경로에 들어오는 요청을 requireAccessToken 인증값과 함께 resumesRouter 에서 처리한다 
export { apiRouter };
// apiRouter 값을 다른 파일에서 사용가능하도록 설정한다