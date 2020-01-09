import { generateRandomString } from '../utils/utils';

export const CREATE_PROJECT_URL =
  'https://schema-test.appt5n.com/project/create/';
export const CREATE_PROJECT_HEADER_TITLE = 'Create New Project';
export const CREATE_PROJECT_HEADER_SUBTITLE = 'Project Info';
export const CREATE_PROJECT_TITLE_LABEL = 'Title';
export const CREATE_PROJECT_TITLE_PLACEHOLDER = 'Project title';
export const CREATE_PROJECT_DESCRIPTION_LABEL = 'Description';
export const CREATE_PROJECT_DESCRIPTION_PLACEHOLDER = 'Project description';
export const CREATE_PROJECT_OWNER_LABEL = 'Owner';
export const CREATE_PROJECT_STATUS_LABEL = 'Status';
export const CREATE_PROJECT_DEFAULT_STATUS = 'In Progress';
export const CREATE_PROJECT_CANCEL_LABEL = 'Cancel';
export const CREATE_PROJECT_SUBMIT_LABEL = 'Finish';
export const CREATE_PROJECT_VALID_TITLE = `Project ${generateRandomString(8)}`;
export const CREATE_PROJECT_TITLE_TOO_LONG = `${generateRandomString(51)}`;
export const CREATE_PROJECT_VALID_DESCRIPTION = `This is random description ${generateRandomString(
  8
)}`;
export const CREATE_PROJECT_DESCRIPTION_TOO_LONG = `${generateRandomString(
  151
)}`;
export const CREATE_PROJECT_EDITED_TITLE = 'This title has been edited';
export const CREATE_PROJECT_EDITED_DESCRIPTION =
  'This description has been edited';
export const CREATE_PROJECT_EMPTY_FIELD_ERROR = 'Required';
export const CREATE_PROJECT_TITLE_TOO_LONG_ERROR =
  'Project Name should have maximum 50 characters';
export const CREATE_PROJECT_DESCRIPTION_TOO_LONG_ERROR =
  'Project Description should have maximum 150 characters';
