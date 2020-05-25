import 'https://deno.land/x/denv/mod.ts';

export const environemt = Deno.env.toObject();

// Database connection
export const DATABASE = {
  host: environemt.DB_HOST || 'localhost',
  name: environemt.DB_NAME || '',
  password: environemt.DB_PASSWORD || '',
  port: Number(environemt.DB_PORT) || 27017,
  username: environemt.DB_USERNAME || '',
};

// Available ENVs
export const ENVS = {
  dev: 'dev',
  heroku: 'heroku',
  prod: 'prod',
  stage: 'stage',
};

// Application ENV
export const { ENV = ENVS.dev } = environemt;

// Application port
export const PORT = Number(environemt.PORT) || 9922;
