export const jwtConstants = {
  secret: 'jwt_secret',
};

export default () => ({
  db: {
    host: 'postgres',
    port: 5432,
    username: 'student',
    password: 'student',
    databaseName: 'kupipodariday',
  },
  emailDisributionSMTPT: {
    email: 'kupipodaryday@yandex.ru',
    password: 'ugekuqlqbdkllftt',
    host: 'smtp.yandex.ru',
    port: 465,
    testHost: 'smtp.ethereal.email',
    testPort: 587,
  },
});
