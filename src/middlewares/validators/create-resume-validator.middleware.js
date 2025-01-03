import Joi from 'joi'; 
// joi 모듈에서 Joi 를 가지고 옴
import { MESSAGES } from '../../constants/message.constant.js';
// message.constant.js 에서  MESSAGES 를 가지고옴
import { MIN_RESUME_LENGTH } from '../../constants/resume.constant.js';
// resume.constant.js 에서 MIN_RESUME_LENGTH 를 가지고옴

const schema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': MESSAGES.RESUMES.COMMON.TITLE.REQUIRED,
  }),
  content: Joi.string().min(MIN_RESUME_LENGTH).required().messages({
    'any.required': MESSAGES.RESUMES.COMMON.CONTENT.REQUIRED,
    'string.min': MESSAGES.RESUMES.COMMON.CONTENT.MIN_LENGTH,
  }),
});
// Joi 사용함으로써 title 과 content에 정규표현식을 설정함


export const createResumeValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
// Joi 를 통해 만든 정규표현식 규칙을 클라이언트에서 보낸 body를 받아 검증을 한다 
 