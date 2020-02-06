import { AUTH0_STAGE_HOST } from './config.constants';

export const ADMIN = 'admin';
export const EDITOR = 'editor';
export const VALID = 'valid';
export const INVALID = 'invalid';
export const CURRENT = 'current';
export const INVITED = 'invited';
export const RANDOM = 'random';
export const GMAIL_URL = 'https://www.gmail.com';
export const RESET_MAIL_TITLE = 'Reset your password';
export const INVITE = 'invitation';
export const RESET = 'reset';
export const EMAIL_TYPE = {
  invitation: 'Invitation',
  reset: 'Reset your password',
};
export const URL_LINK = {
  reset: new RegExp(`${AUTH0_STAGE_HOST}\/lo\/reset`),
  invitation: new RegExp(`${AUTH0_STAGE_HOST}\/lo\/reset`),
};
