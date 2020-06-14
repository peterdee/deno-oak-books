import 'https://deno.land/x/denv/mod.ts';

export const environment = Deno.env.toObject();

// Available account types
export const ACCOUNT_TYPES = {
  admin: 'admin',
  user: 'user',
};

// Admin data
export const ADMIN = {
  email: environment.ADMIN_EMAIL,
  firstName: environment.ADMIN_FIRST_NAME,
  lastName: environment.ADMIN_LAST_NAME,
  password: environment.ADMIN_PASSWORD,
};

// Database connection
export const DATABASE = {
  host: environment.DB_HOST || 'localhost',
  name: environment.DB_NAME || '',
  password: environment.DB_PASSWORD || '',
  port: Number(environment.DB_PORT) || 27017,
  username: environment.DB_USERNAME || '',
};

// Available ENVs
export const ENVS = {
  dev: 'dev',
  heroku: 'heroku',
  prod: 'prod',
  stage: 'stage',
};

// Application ENV
export const { ENV = ENVS.dev } = environment;

// Frontend URI
export const { FRONTEND_URI = 'http://localhost:3000' } = environment;

// The 'from' field for mailer module
export const { MAILER_FROM = 'user@host.com' } = environment;

// Application port
export const PORT = Number(environment.PORT) || 9922;

// Backend URI
export const { BACKEND_URI = `http://localhost:${PORT}` } = environment;

// SendGrid API key
export const { SENDGRID_KEY = '' } = environment;

// Send error messages via email
export const SEND_ERROR_MESSAGES = environment.SEND_ERROR_MESSAGES === 'true';

// Server messages
export const SERVER_MESSAGES = {
  accessDenied: 'ACCESS_DENIED',
  emailIsAlreadyInUse: 'EMAIL_IS_ALREADY_IN_USE',
  expiredRecoveryCode: 'EXPIRED_RECOVERY_CODE',
  expiredToken: 'EXPIRED_TOKEN',
  internalServerError: 'INTERNAL_SERVER_ERROR',
  invalidConfirmationCode: 'INVALID_CONFIRMATION_CODE',
  invalidRecoveryCode: 'INVALID_RECOVERY_CODE',
  invalidToken: 'INVALID_TOKEN',
  missingData: 'MISSING_DATA',
  missingToken: 'MISSING_TOKEN',
  noAdditionalInformation: 'NO_ADDITIONAL_INFORMATION',
  ok: 'OK',
  oldPasswordIsInvalid: 'OLD_PASSWORD_IS_INVALID',
  userNotFound: 'USER_NOT_FOUND',
};

// Tokens
export const TOKENS = {
  access: {
    expiration: Number(environment.ACCESS_TOKEN_EXPIRATION) || 86000,
    secret: environment.ACCESS_TOKEN_SECRET || 'secrets-ghosts',
  },
  refresh: {
    expiration: Number(environment.REFRESH_TOKEN_EXPIRATION) || 600000,
    secret: environment.REFRESH_TOKEN_SECRET || 'secrets-wenches',
  },
}
