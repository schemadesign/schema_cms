import { randomizeEmail, generateRandomString } from '../../helpers/utils';

export const USERS = {
  existingAdmin: {
    login: {
      valid: process.env.SCHEMA_ADMIN_VALID_NAME,
      invalid: process.env.SCHEMA_ADMIN_INVALID_NAME,
      empty: '',
    },
    password: {
      valid: { enter: process.env.SCHEMA_ADMIN_VALID_PASSWORD },
      invalid: { enter: process.env.SCHEMA_INVALID_PASSWORD },
      empty: { enter: '' },
    },
    firstName: process.env.SCHEMA_ADMIN_FIRST_NAME,
    lastName: process.env.SCHEMA_ADMIN_LAST_NAME,
  },
  existingEditor: {
    login: {
      valid: process.env.SCHEMA_EDITOR_VALID_NAME,
      invalid: process.env.SCHEMA_EDITOR_INVALID_NAME,
      empty: '',
    },
    password: {
      valid: { enter: process.env.SCHEMA_EDITOR_VALID_PASSWORD },
      invalid: { enter: process.env.SCHEMA_INVALID_PASSWORD },
      empty: { enter: '' },
    },
    firstName: process.env.SCHEMA_EDITOR_FIRST_NAME,
    lastName: process.env.SCHEMA_EDITOR_LAST_NAME,
  },
  invitedAdmin: {
    login: {
      valid: process.env.SCHEMA_INVITED_VALID_EMAIL,
      random: randomizeEmail(
        process.env.SCHEMA_INVITED_EMAIL_LOCAL_PART,
        process.env.SCHEMA_INVITED_EMAIL_DOMAIN
      ).toLowerCase(),
      invalid: process.env.SCHEMA_ADMIN_INVALID_NAME,
      empty: '',
    },
    password: {
      invalid: { enter: process.env.SCHEMA_INVALID_PASSWORD, confirm: `X1!${generateRandomString(8)}` },
      valid: {
        enter: process.env.SCHEMA_ADMIN_VALID_PASSWORD,
        get confirm() {
          return this.enter;
        },
      },
      empty: { enter: '' },
    },
    firstName: process.env.DJANGO_FIRST_NAME_ADMIN,
    lastName: process.env.DJANGO_LAST_NAME,
  },
  reset: {
    login: {
      valid: process.env.SCHEMA_INVITED_VALID_EMAIL,
      invalid: process.env.SCHEMA_INVITED_INVALID_EMAIL,
    },
    password: {
      invalid: { enter: process.env.SCHEMA_INVALID_PASSWORD, confirm: `X1!${generateRandomString(8)}` },
      valid: {
        enter: `X1!${generateRandomString(8)}`,
        get confirm() {
          return this.enter;
        },
      },
    },
  },
};

export const DJANGO = { userName: process.env.DJANGO_STAGE_LOGIN, password: process.env.DJANGO_STAGE_PASSWORD };
