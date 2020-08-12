import path from 'path';

export const TOKEN_AUTHORIZE_PROMPT = 'Authorize this app by visiting this url:';
export const TOKEN_ENTER_CODE_PROMPT = 'Enter the code from that page here: ';
export const TOKEN_ERROR_MSG = 'Error retrieving access token';
export const TOKEN_SUCCESS_MSG = 'Token stored to ';

export const MARK_EMAIL_ERROR_MSG = 'Failed to mark an email. Check your query and make sure the email exists.';
export const MARK_EMAIL_SUCCESS_MSG = 'Successfully marked an email with ID: ';
export const UNREAD = 'UNREAD';

export const DELETE_EMAIL_ERROR_MSG = 'Failed to delete an email. Check your query and make sure the email exists.';
export const DELETE_EMAIL_SUCCESS_MSG = 'Successfully deleted an email with ID: ';

export const EMAIL_ID_NOT_FOUND_MSG = 'EmailId is undefined. Check your query.';
export const NO_EMAILS_FOUND_MSG = 'There are no emails for given query';

export const TOKEN_PATH = path.resolve(__dirname, 'token.json');
export const SCOPES = ['https://mail.google.com'];
export const USER_ID = 'me';
export const BASE64 = 'base64';
export const UTF8 = 'utf8';
export const V1 = 'v1';
export const OFFLINE = 'offline';

export const URL_REGEX = new RegExp(/((http|https):\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g);
export const INVITATION_QUERY = 'from:(invitation@schemacms.com)';
export const RESET_PASSWORD_QUERY = 'from:(no-reply@auth0user.net) subject:(Reset your password)';
export const EMAIL_BODY_TEXT = new RegExp(
  /Welcome to Schema CMS! Please click the following link to set your password and get started:/
);
