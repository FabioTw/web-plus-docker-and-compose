require('dotenv').config();

const {
  JWT_SECRET,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_PGDATA,
} = process.env;

module.exports = {
  apps: [
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
  ],
};
