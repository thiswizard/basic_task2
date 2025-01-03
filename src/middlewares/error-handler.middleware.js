import { HTTP_STATUS } from '../constants/http-status.constant.js';
// http-status.constant.js 에서 HTTP_STATUS 를 가지고옴

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // joi에서 발생한 에러 처리
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: HTTP_STATUS.BAD_REQUEST,
      message: err.message,
    });
  }

  // 그 밖의 예상치 못한 에러 처리
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
  });
};
// 다른 라우터에서 발생한 에러를 처리함 
// 만약 에러 이름이 ValidationError 일 경우 와 그 밖에 다른 에러일경우 각각 다르게 처리하도록 함