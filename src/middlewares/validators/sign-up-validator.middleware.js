import Joi from 'joi';
// joi 모듈에서 Joi 를 가지고 옴
import { MESSAGES } from '../../constants/message.constant.js';
// message.constant.js 에서 MESSAGES 값을 가지고  옴
import { MIN_PASSWORD_LENGTH } from '../../constants/auth.constant.js';
// auth.constant.js 에서 MIN_PASSWORD_LENGTH 를 가지고옴

const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
    'string.email': MESSAGES.AUTH.COMMON.EMAIL.INVALID_FORMAT,
  }),
  password: Joi.string().required().min(MIN_PASSWORD_LENGTH).messages({
    'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQURIED,
    'string.min': MESSAGES.AUTH.COMMON.PASSWORD.MIN_LENGTH,
  }),
  passwordConfirm: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.required': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.REQURIED,
    'any.only': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.NOT_MACHTED_WITH_PASSWORD,
  }),
  name: Joi.string().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.NAME.REQURIED,
  }),
});
// Joi 사용함으로써 email ,password ,passwordConfirm ,name 에 정규표현식을 설정함 


export const signUpValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
// Joi 를 통해 만든 정규표현식 규칙을 클라이언트에서 보낸 body를 받아 검증을 한다 