import express from 'express';
// express 모듈에서 express 기능을 가지고 옴
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
// require-access-token.middleware.js 에서 requireAccessToken 값을 가지고  옴
import { HTTP_STATUS } from '../constants/http-status.constant.js';
// http-status.constant.js 에서 HTTP_STATUS 값을 가지고  옴
import { MESSAGES } from '../constants/message.constant.js';
// message.constant.js 에서 MESSAGES 값을 가지고  옴

const usersRouter = express.Router();
// express 의 라우터 객체를 생성해서 usersRouter 변수에 할당함

usersRouter.get('/me', requireAccessToken, (req, res, next) => {
  try {
    const data = req.user;

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.USERS.READ_ME.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});
// requireAccessToken 통해 받은 인증값을 통해서 값(status , json)을 처리한다


export { usersRouter };
// usersRouter 값을 다른 파일에서 사용할수 있도록 한다