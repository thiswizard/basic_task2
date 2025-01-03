import { PrismaClient } from '@prisma/client';
// prisma/client 안에서 PrismaClient 기능을 가지고 온다

export const prisma = new PrismaClient({
  // Prisma를 이용해 데이터베이스를 접근할 때, SQL을 출력해줍니다.
  log: ['query', 'info', 'warn', 'error'],

  // 에러 메시지를 평문이 아닌, 개발자가 읽기 쉬운 형태로 출력해줍니다.
  errorFormat: 'pretty',
}); // PrismaClient 인스턴스를 생성합니다.

try {
  await prisma.$connect();
  console.log('DB 연결에 성공했습니다.');
} catch (error) {
  console.error('DB 연결에 실패했습니다.', error);
}
// prisma.$connect() 를 통해서 prisma랑 데이터베이스랑 연결을 하고 성공하면 DB 연결에 성공했습니다 출력
// 에러가 발생하면 DB 연결에 실패했습니다 메세지랑 함께 자세한 error 를 보여줌