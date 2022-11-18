// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const {
  JWT_SECRET,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_PGDATA,
} = process.env;

export const apps = [
  {
    name: 'kupipodariday-backend',
    script: './dist/main.js',
    env_env_production: {
      NODE_ENV: 'production',
      JWT_SECRET,
      POSTGRES_PASSWORD,
      POSTGRES_DB,
      POSTGRES_HOST,
      POSTGRES_USER,
      POSTGRES_PGDATA,
    },
  },
];
