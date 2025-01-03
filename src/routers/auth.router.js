import express from 'express';
// express 모듈에서 express 기능을 가지고 옴
import bcrypt from 'bcrypt';
// bcrypt 모듈에서 bcrypt 기능을 가지고 옴
import jwt from 'jsonwebtoken';
// jsonwebtoken 모듈에서 jwt 기능을 가지고 옴
import { HTTP_STATUS } from '../constants/http-status.constant.js';
// http-status.constant.js 에서 HTTP_STATUS 를 가지고 온다
import { MESSAGES } from '../constants/message.constant.js';
// message.constant.js 에서 MESSAGES 값을 가지고  옴
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
// sign-up-validator.middleware.js 에서 signUpValidator 값을 가지고  옴
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
// sign-in-validator.middleware.js 에서 signInValidator 값을 가지고  옴
import { prisma } from '../utils/prisma.util.js';
// prisma.util.js 에서 prisma 값을 가지고 옴
import {
  ACCESS_TOKEN_EXPIRES_IN,
  HASH_SALT_ROUNDS,
} from '../constants/auth.constant.js';
// auth.constant.js 에서 ACCESS_TOKEN_EXPIRES_IN,HASH_SALT_ROUNDS 값을 가지고 옴
import { ACCESS_TOKEN_SECRET } from '../constants/env.constant.js';
// env.constant.js 에서 ACCESS_TOKEN_SECRET 값을 가지고 옴

const authRouter = express.Router();
// express 의 라우터 객체를 생성해서 authRouter 변수에 할당함

authRouter.post('/sign-up', signUpValidator, async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const existedUser = await prisma.user.findUnique({ where: { email } });

    // 이메일이 중복된 경우
    if (existedUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: HTTP_STATUS.CONFLICT,
        message: MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED,
      });
    }

    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);

    const data = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    data.password = undefined;

    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});
// "/sign-up" 경로로 email, password, name body 요청이 들어왔을떄 
// signUpValidator를 통해 Joi 검사한다음 password는 bcrypt를 통해 암호화 한다음 
// user 모델에 값을 저장하고 사용자에게 정상적으로 회원가입을 했다는 응답을 한다



authRouter.post('/sign-in', signInValidator, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    const isPasswordMatched =
      user && bcrypt.compareSync(password, user.password);

    if (!isPasswordMatched) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.UNAUTHORIZED,
      });
    }

    const payload = { id: user.id };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
});
// "/sign-in" 경로로 email, password 요청이 들어왔을떄 
// signInValidator를 통해 Joi 검사한다음 email 하고 password가 정상으로 확인되면 JWT 토큰을 발행해
// 클라이언트에게 로그인이 정상적으로 되었다는 확인 및 토큰을 발행한다



export { authRouter };
// authRouter 값을 다른 파일에서 사용할수 있도록 한다