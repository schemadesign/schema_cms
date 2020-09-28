import { randomizeEmail, generateRandomString } from '../../helpers/utils';

export const USERS = {
  existingAdmin: {
    login: {
      valid: {
        app: {
          django: process.env.SCHEMA_ADMIN_VALID_NAME,
          schemaCMS: process.env.SCHEMA_ADMIN_VALID_NAME,
        },
      },
      random: {
        app: {
          django: randomizeEmail(
            process.env.SCHEMA_INVITED_EMAIL_LOCAL_PART,
            process.env.SCHEMA_INVITED_EMAIL_DOMAIN
          ).toLowerCase(),
          schemaCMS: randomizeEmail(
            process.env.SCHEMA_INVITED_EMAIL_LOCAL_PART,
            process.env.SCHEMA_INVITED_EMAIL_DOMAIN
          ).toLowerCase(),
        },
      },
      notExisting: {
        app: {
          django: process.env.SCHEMA_ADMIN_INVALID_NAME,
          schemaCMS: process.env.SCHEMA_ADMIN_INVALID_NAME,
        },
      },
      invalid: {
        app: {
          django: 'django@',
          schemaCMS: 'schema@',
        },
      },
      empty: {
        app: {
          django: '',
          schemaCMS: '',
        },
      },
    },
    password: {
      valid: { enter: process.env.SCHEMA_ADMIN_VALID_PASSWORD },
      invalid: { enter: process.env.SCHEMA_INVALID_PASSWORD },
      empty: { enter: '' },
    },
    firstName: {
      valid: {
        app: {
          django: process.env.SCHEMA_ADMIN_FIRST_NAME,
          schemaCMS: process.env.SCHEMA_ADMIN_FIRST_NAME,
        },
      },
      tooShort: {
        app: {
          django: 'a',
          schemaCMS: 'b',
        },
      },
      empty: {
        app: {
          django: '',
          schemaCMS: '',
        },
      },
    },
    lastName: {
      valid: {
        app: {
          django: process.env.SCHEMA_ADMIN_LAST_NAME,
          schemaCMS: process.env.SCHEMA_ADMIN_LAST_NAME,
        },
      },
      tooShort: {
        app: {
          django: 'a',
          schemaCMS: 'b',
        },
      },
      empty: {
        app: {
          django: '',
          schemaCMS: '',
        },
      },
    },
  },
  existingEditor: {
    login: {
      valid: {
        app: {
          django: process.env.SCHEMA_EDITOR_VALID_NAME,
          schemaCMS: process.env.SCHEMA_EDITOR_VALID_NAME,
        },
      },
      random: {
        app: {
          django: randomizeEmail(
            process.env.SCHEMA_INVITED_EMAIL_LOCAL_PART,
            process.env.SCHEMA_INVITED_EMAIL_DOMAIN
          ).toLowerCase(),
          schemaCMS: randomizeEmail(
            process.env.SCHEMA_INVITED_EMAIL_LOCAL_PART,
            process.env.SCHEMA_INVITED_EMAIL_DOMAIN
          ).toLowerCase(),
        },
      },
      notExisting: {
        app: {
          django: process.env.SCHEMA_EDITOR_INVALID_NAME,
          schemaCMS: process.env.SCHEMA_EDITOR_INVALID_NAME,
        },
      },
      invalid: {
        app: {
          django: 'django@',
          schemaCMS: 'schema@',
        },
      },
      empty: {
        app: {
          django: '',
          schemaCMS: '',
        },
      },
    },
    password: {
      valid: { enter: process.env.SCHEMA_EDITOR_VALID_PASSWORD },
      invalid: { enter: process.env.SCHEMA_INVALID_PASSWORD },
      empty: { enter: '' },
    },
    firstName: {
      valid: {
        app: {
          django: process.env.SCHEMA_EDITOR_FIRST_NAME,
          schemaCMS: process.env.SCHEMA_EDITOR_FIRST_NAME,
        },
      },
      tooShort: {
        app: {
          django: 'a',
          schemaCMS: 'b',
        },
      },
      empty: {
        app: {
          django: '',
          schemaCMS: '',
        },
      },
    },
    lastName: {
      valid: {
        app: {
          django: process.env.SCHEMA_EDITOR_LAST_NAME,
          schemaCMS: process.env.SCHEMA_EDITOR_LAST_NAME,
        },
      },
      tooShort: {
        app: {
          django: 'a',
          schemaCMS: 'b',
        },
      },
      empty: {
        app: {
          django: '',
          schemaCMS: '',
        },
      },
    },
  },
  invitedAdmin: {
    login: {
      valid: {
        app: {
          django: process.env.SCHEMA_INVITED_VALID_EMAIL,
          schemaCMS: process.env.SCHEMA_INVITED_VALID_EMAIL,
        },
      },
      random: {
        app: {
          django: randomizeEmail(
            process.env.SCHEMA_INVITED_EMAIL_LOCAL_PART,
            process.env.SCHEMA_INVITED_EMAIL_DOMAIN
          ).toLowerCase(),
          schemaCMS: randomizeEmail(
            process.env.SCHEMA_INVITED_EMAIL_LOCAL_PART,
            process.env.SCHEMA_INVITED_EMAIL_DOMAIN
          ).toLowerCase(),
        },
      },
      notExisting: {
        app: {
          django: process.env.SCHEMA_ADMIN_INVALID_NAME,
          schemaCMS: process.env.SCHEMA_ADMIN_INVALID_NAME,
        },
      },
      invalid: {
        app: {
          django: 'django@',
          schemaCMS: 'schema@',
        },
      },
      empty: {
        app: {
          django: '',
          schemaCMS: '',
        },
      },
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
    firstName: {
      valid: {
        app: {
          django: process.env.SCHEMA_ADMIN_FIRST_NAME_INVITED,
          schemaCMS: process.env.SCHEMA_ADMIN_FIRST_NAME_INVITED,
        },
      },
      tooShort: {
        app: {
          django: 'a',
          schemaCMS: 'b',
        },
      },
      empty: {
        app: {
          django: '',
          schemaCMS: '',
        },
      },
    },
    lastName: {
      valid: {
        app: {
          django: process.env.DJANGO_LAST_NAME,
          schemaCMS: process.env.SCHEMA_ADMIN_LAST_NAME_INVITED,
        },
      },
      tooShort: {
        app: {
          django: 'a',
          schemaCMS: 'b',
        },
      },
      empty: {
        app: {
          django: '',
          schemaCMS: '',
        },
      },
    },
  },
  invitedEditor: {
    login: {
      valid: {
        app: {
          django: process.env.SCHEMA_INVITED_VALID_EMAIL,
          schemaCMS: process.env.SCHEMA_INVITED_VALID_EMAIL,
        },
      },
      random: {
        app: {
          django: randomizeEmail(
            process.env.SCHEMA_INVITED_EMAIL_LOCAL_PART,
            process.env.SCHEMA_INVITED_EMAIL_DOMAIN
          ).toLowerCase(),
          schemaCMS: randomizeEmail(
            process.env.SCHEMA_INVITED_EMAIL_LOCAL_PART,
            process.env.SCHEMA_INVITED_EMAIL_DOMAIN
          ).toLowerCase(),
        },
      },
      notExisting: {
        app: {
          django: process.env.SCHEMA_EDITOR_INVALID_NAME,
          schemaCMS: process.env.SCHEMA_EDITOR_INVALID_NAME,
        },
      },
      invalid: {
        app: {
          django: 'django@',
          schemaCMS: 'schema@',
        },
      },
      empty: {
        app: {
          django: '',
          schemaCMS: '',
        },
      },
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
    firstName: {
      valid: {
        app: {
          django: process.env.SCHEMA_EDITOR_FIRST_NAME_INVITED,
          schemaCMS: process.env.SCHEMA_EDITOR_FIRST_NAME_INVITED,
        },
      },
      tooShort: {
        app: {
          django: 'a',
          schemaCMS: 'b',
        },
      },
      empty: {
        app: {
          django: '',
          schemaCMS: '',
        },
      },
    },
    lastName: {
      valid: {
        app: {
          django: process.env.DJANGO_LAST_NAME,
          schemaCMS: process.env.SCHEMA_EDITOR_LAST_NAME_INVITED,
        },
      },
      tooShort: {
        app: {
          django: 'a',
          schemaCMS: 'b',
        },
      },
      empty: {
        app: {
          django: '',
          schemaCMS: '',
        },
      },
    },
  },
  reset: {
    login: {
      valid: {
        app: {
          django: process.env.SCHEMA_INVITED_VALID_EMAIL,
          schemaCMS: process.env.SCHEMA_INVITED_VALID_EMAIL,
        },
      },
      invalid: {
        app: {
          django: process.env.SCHEMA_INVITED_INVALID_EMAIL,
          schemaCMS: process.env.SCHEMA_INVITED_INVALID_EMAIL,
        },
      },
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
