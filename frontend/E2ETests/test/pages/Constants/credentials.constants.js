import { randomizeEmail, generateRandomString } from '../../helpers/utils';
import {
  DJANGO_STAGE_LOGIN,
  DJANGO_STAGE_PASSWORD,
  SCHEMA_ADMIN_FIRST_NAME,
  SCHEMA_ADMIN_INVALID_NAME,
  SCHEMA_ADMIN_LAST_NAME,
  SCHEMA_ADMIN_VALID_NAME,
  SCHEMA_ADMIN_VALID_PASSWORD,
  SCHEMA_EDITOR_FIRST_NAME,
  SCHEMA_EDITOR_INVALID_NAME,
  SCHEMA_EDITOR_LAST_NAME,
  SCHEMA_EDITOR_VALID_NAME,
  SCHEMA_EDITOR_VALID_PASSWORD,
  SCHEMA_EXISTING_VALID_LOGIN,
  SCHEMA_INVALID_PASSWORD,
  SCHEMA_INVITED_EMAIL_DOMAIN,
  SCHEMA_INVITED_EMAIL_LOCAL_PART,
  SCHEMA_INVITED_INVALID_EMAIL,
  SCHEMA_INVITED_VALID_EMAIL,
} from '../../credentials/credentials';

export const USERS = {
  admin: {
    login: {
      valid: SCHEMA_ADMIN_VALID_NAME,
      invalid: SCHEMA_ADMIN_INVALID_NAME,
      empty: '',
    },
    password: {
      valid: { enter: SCHEMA_ADMIN_VALID_PASSWORD },
      invalid: { enter: SCHEMA_INVALID_PASSWORD },
      empty: { enter: '' },
    },
    firstName: SCHEMA_ADMIN_FIRST_NAME,
    lastName: SCHEMA_ADMIN_LAST_NAME,
  },
  editor: {
    login: {
      valid: SCHEMA_EDITOR_VALID_NAME,
      invalid: SCHEMA_EDITOR_INVALID_NAME,
      empty: '',
    },
    password: {
      valid: { enter: SCHEMA_EDITOR_VALID_PASSWORD },
      invalid: { enter: SCHEMA_INVALID_PASSWORD },
      empty: { enter: '' },
    },
    firstName: SCHEMA_EDITOR_FIRST_NAME,
    lastName: SCHEMA_EDITOR_LAST_NAME,
  },
  invited: {
    login: {
      valid: SCHEMA_INVITED_VALID_EMAIL,
      random: randomizeEmail(SCHEMA_INVITED_EMAIL_LOCAL_PART, SCHEMA_INVITED_EMAIL_DOMAIN).toLowerCase(),
    },
    password: {
      invalid: { enter: SCHEMA_INVALID_PASSWORD, confirm: `X1!${generateRandomString(8)}` },
      valid: {
        enter: `X1!${generateRandomString(10)}`,
        get confirm() {
          return this.enter;
        },
      },
    },
  },
  existing: {
    login: {
      valid: SCHEMA_EXISTING_VALID_LOGIN,
    },
  },
  reset: {
    login: {
      valid: SCHEMA_INVITED_VALID_EMAIL,
      invalid: SCHEMA_INVITED_INVALID_EMAIL,
    },
    password: {
      invalid: { enter: SCHEMA_INVALID_PASSWORD, confirm: `X1!${generateRandomString(8)}` },
      valid: {
        enter: `X1!${generateRandomString(8)}`,
        get confirm() {
          return this.enter;
        },
      },
    },
  },
};

export const DJANGO = { userName: DJANGO_STAGE_LOGIN, password: DJANGO_STAGE_PASSWORD };
