import express from 'express';
// express 모듈에서 express 기능을 가지고 옴
import { HTTP_STATUS } from '../constants/http-status.constant.js';
// http-status.constant.js 에서 HTTP_STATUS 값을 가지고  옴
import { MESSAGES } from '../constants/message.constant.js';
// message.constant.js 에서 MESSAGES 값을 가지고  옴
import { createResumeValidator } from '../middlewares/validators/create-resume-validator.middleware.js';
// create-resume-validator.middleware.js 에서 createResumeValidator 값을 가지고  옴
import { prisma } from '../utils/prisma.util.js';
// prisma.util.js 에서 prisma 값을 가지고 옴
import { updateResumeValidator } from '../middlewares/validators/update-resume-validator.middleware.js';
// update-resume-validator.middleware.js 에서 updateResumeValidator 값을 가지고 옴

const resumesRouter = express.Router();
// express 에 새로운 라우터 객체를 resumesRouter 변수에 할당함



// 이력서 생성
resumesRouter.post('/', createResumeValidator, async (req, res, next) => {
  try {
    const user = req.user;
    const { title, content } = req.body;
    const authorId = user.id;

    const data = await prisma.resume.create({
      data: {
        authorId,
        title,
        content,
      },
    });

    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.RESUMES.CREATE.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// "/" 경로로 title, content body 요청이 들어왔을떄 인증을 확인하고 
// prisma를 이용해 resume 모델에 authorId,title,content 필드 값을 생성한다음 상태값과 json을 클라이언트에게 응답한다




// 이력서 목록 조회
resumesRouter.get('/', async (req, res, next) => {
  try {
    const user = req.user;
    const authorId = user.id;

    let { sort } = req.query;

    sort = sort?.toLowerCase();

    if (sort !== 'desc' && sort !== 'asc') {
      sort = 'desc';
    }

    let data = await prisma.resume.findMany({
      where: { authorId },
      orderBy: {
        createdAt: sort,
      },
      include: {
        author: true,
      },
    });

    data = data.map((resume) => {
      return {
        id: resume.id,
        authorName: resume.author.name,
        title: resume.title,
        content: resume.content,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      };
    });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});
// "/" 경로로 요청이 들어왔을떄 prisma 를 사용해 resume 모델에 있는 authorId 가 있는 모든 값들을 
// createdAt 필드 기준으로 정렬해서 클라리언트에게 이력서의 목록들을 보여준다


// 이력서 상세 조회
resumesRouter.get('/:id', async (req, res, next) => {
  try {
    const user = req.user;
    const authorId = user.id;

    const { id } = req.params;

    let data = await prisma.resume.findUnique({
      where: { id: +id, authorId },
      include: { author: true },
    });

    if (!data) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    data = {
      id: data.id,
      authorName: data.author.name,
      title: data.title,
      content: data.content,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});
// "/:id" 경로로 요청이 들어왔을떄 id 를 파라미터 값으로 사용해 id에 대응하는 
// 데이터를 찾고 그 데이터를 사용자에게 응답한다



// 이력서 수정
resumesRouter.put('/:id', updateResumeValidator, async (req, res, next) => {
  try {
    const user = req.user;
    const authorId = user.id;

    const { id } = req.params;

    const { title, content } = req.body;

    let existedResume = await prisma.resume.findUnique({
      where: { id: +id, authorId },
    });

    if (!existedResume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    const data = await prisma.resume.update({
      where: { id: +id, authorId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.UPDATE.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});
// "/:id" 경로로 요청이 들어왔을떄 인증을 한뒤 id 를 파라미터 값으로 사용해 id에 대응하는 
// 데이터를 찾고 그 데이터를 사용자에게 응답한다




// 이력서 삭제
resumesRouter.delete('/:id', async (req, res, next) => {
  try {
    const user = req.user;
    const authorId = user.id;

    const { id } = req.params;

    let existedResume = await prisma.resume.findUnique({
      where: { id: +id, authorId },
    });

    if (!existedResume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    const data = await prisma.resume.delete({ where: { id: +id, authorId } });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.DELETE.SUCCEED,
      data: { id: data.id },
    });
  } catch (error) {
    next(error);
  }
});
// "/:id" 경로로 삭제요청이 들어왔을떄 id 를 파라미터 값으로 사용해 id에 대응하는 
// 데이터를 찾고 그 데이터를 삭제한뒤 사용자에게 응답한다

export { resumesRouter };
// resumesRouter 값을 다른파일에서 사용할수 있도록 한다