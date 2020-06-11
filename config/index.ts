import 'https://deno.land/x/denv/mod.ts';

export const environemt = Deno.env.toObject();

// Available account types
export const ACCOUNT_TYPES = {
  admin: 'admin',
  user: 'user',
};

// Admin data
export const ADMIN = {
  email: environemt.ADMIN_EMAIL,
  firstName: environemt.ADMIN_FIRST_NAME,
  lastName: environemt.ADMIN_LAST_NAME,
  password: environemt.ADMIN_PASSWORD,
};

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

// The 'from' field for mailer module
export const MAILER_FROM = environemt.MAILER_FROM || 'user@host.com'

// Application port
export const PORT = Number(environemt.PORT) || 9922;

// SendGrid API key
export const SENDGRID_KEY = environemt.SENDGRID_KEY || '';

// Send error messages via email
export const SEND_ERROR_MESSAGES = environemt.SEND_ERROR_MESSAGES === 'true';

// Server messages
export const SERVER_MESSAGES = {
  accessDenied: 'ACCESS_DENIED',
  emailIsAlreadyInUse: 'EMAIL_IS_ALREADY_IN_USE',
  internalServerError: 'INTERNAL_SERVER_ERROR',
  missingData: 'MISSING_DATA',
  missingToken: 'MISSING_TOKEN',
  noAdditionalInformation: 'NO_ADDITIONAL_INFORMATION',
  ok: 'OK',
};

// Tokens
export const TOKENS = {
  access: {
    expiration: Number(environemt.ACCESS_TOKEN_EXPIRATION) || 86000,
    secret: environemt.ACCESS_TOKEN_SECRET || 'secrets-ghosts',
  },
  refresh: {
    expiration: Number(environemt.REFRESH_TOKEN_EXPIRATION) || 600000,
    secret: environemt.REFRESH_TOKEN_SECRET || 'secrets-wenches',
  },
}
