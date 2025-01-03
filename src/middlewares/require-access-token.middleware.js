import jwt from 'jsonwebtoken';
// jsonwebtoken 모듈에서 jwt 기능을 가지고 옴
import { HTTP_STATUS } from '../constants/http-status.constant.js';
// http-status.constant.js 에서 HTTP_STATUS 를 가지고옴
import { MESSAGES } from '../constants/message.constant.js';
// message.constant.js 에서 MESSAGES 값을 가지고  옴
import { ACCESS_TOKEN_SECRET } from '../constants/env.constant.js';
//  env.constant.js 에서 ACCESS_TOKEN_SECRET 값을 가지고 옴
import { prisma } from '../utils/prisma.util.js';
// prisma.util.js 에서 prisma 값을 가지고 옴

export const requireAccessToken = async (req, res, next) => {
  try {
    // 인증 정보 파싱
    const authorization = req.headers.authorization;

    // Authorization이 없는 경우
    if (!authorization) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NO_TOKEN,
      });
    }

    // JWT 표준 인증 형태와 일치하지 않는 경우
    const [type, accessToken] = authorization.split(' ');

    if (type !== 'Bearer') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE,
      });
    }

    // AccessToken이 없는 경우
    if (!accessToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NO_TOKEN,
      });
    }

    let payload;
    try {
      payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch (error) {
      // AccessToken의 유효기한이 지난 경우
      if (error.name === 'TokenExpiredError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.AUTH.COMMON.JWT.EXPIRED,
        });
      }
      // 그 밖의 AccessToken 검증에 실패한 경우
      else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.AUTH.COMMON.JWT.INVALID,
        });
      }
    }

    // Payload에 담긴 사용자 ID와 일치하는 사용자가 없는 경우
    const { id } = payload;
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.NO_USER,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
// 인증 과정을 처리함 클라이언트 쪽에서 보낸 JWT 토큰을 받아서 
// 해당 토큰이 타입 검사 및 서버에서 발급한 토큰이 맞는지 유효기간이 준수한지 검사함
// 인증이 되면 토큰을 보낸 사용자를 DB에서 찾아 값을 다음 미들웨어로 인증을 넘긴다