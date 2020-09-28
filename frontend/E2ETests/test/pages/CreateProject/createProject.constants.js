import { generateRandomString } from '../../helpers/utils';

export const CREATE_PROJECT_PAGE = 'createProject';
export const CREATE_PROJECT_URL = `${browser.config.baseUrl}/project/create/`;
export const CREATE_PROJECT_EMPTY_FIELD_ERROR = 'Required';
export const CREATE_PROJECT_TITLE_TOO_LONG_ERROR = 'Project Name should have maximum 100 characters';
export const CREATE_PROJECT_DESCRIPTION_TOO_LONG_ERROR = 'Project Description should have maximum 150 characters';
export const CREATE_PROJECT_INVALID_DOMAIN_ERROR = 'Invalid URL';

const CREATE_PROJECT_TITLE_LABEL = 'Title';
const CREATE_PROJECT_TITLE_PLACEHOLDER = 'Project title';
const CREATE_PROJECT_DESCRIPTION_LABEL = 'Description';
const CREATE_PROJECT_DESCRIPTION_PLACEHOLDER = 'Project description';
const CREATE_PROJECT_OWNER_LABEL = 'Owner';
const CREATE_PROJECT_STATUS_LABEL = 'Status';
const CREATE_PROJECT_CANCEL_LABEL = 'Cancel';
const CREATE_PROJECT_SUBMIT_LABEL = 'Finish';
const CREATE_PROJECT_DOMAIN_LABEL = 'Domain';
const CREATE_PROJECT_CREATION_DATE_TEXT = 'a few seconds ago';
export const CREATE_PROJECT_DEFAULT_STATUS = 'In Progress';
export const CREATE_PROJECT_OWNER_VALUE = {
  invitedAdmin: `${process.env.DJANGO_FIRST_NAME_ADMIN} ${process.env.DJANGO_LAST_NAME}`,
  existingAdmin: `${process.env.SCHEMA_ADMIN_FIRST_NAME} ${process.env.SCHEMA_ADMIN_LAST_NAME}`,
};
const PLACEHOLDER_VALUE = 'placeholder';

export const CREATE_PROJECT_ELEMENT_VALUES = [
  CREATE_PROJECT_TITLE_LABEL,
  CREATE_PROJECT_DESCRIPTION_LABEL,
  CREATE_PROJECT_DOMAIN_LABEL,
  CREATE_PROJECT_OWNER_LABEL,
  CREATE_PROJECT_STATUS_LABEL,
  CREATE_PROJECT_DEFAULT_STATUS,
  CREATE_PROJECT_CANCEL_LABEL,
  CREATE_PROJECT_SUBMIT_LABEL,
];

export const ATTRIBUTE_VALUES = [PLACEHOLDER_VALUE, PLACEHOLDER_VALUE];
export const CREATE_PROJECT_ATTRIBUTE_VALUES = [
  CREATE_PROJECT_TITLE_PLACEHOLDER,
  CREATE_PROJECT_DESCRIPTION_PLACEHOLDER,
];

export const CREATE_PROJECT = {
  title: {
    valid: `Project ${generateRandomString(8)}`,
    empty: '',
    tooLong: `${generateRandomString(101)}`,
    edited: 'This title has been edited',
  },
  description: {
    valid: `This is a random description ${generateRandomString(8)}`,
    empty: '',
    tooLong: `${generateRandomString(151)}`,
    edited: 'This description has been edited',
  },
  domain: {
    valid: 'http://thisisvaliddomain.com',
    invalid: 'this is invalid domain',
    empty: '',
    tooLong: `${generateRandomString(151)}`,
    edited: 'https://edited-domain.com',
  },
  get api() {
    return `schemacms/api/${this.title.valid}`;
  },
};

