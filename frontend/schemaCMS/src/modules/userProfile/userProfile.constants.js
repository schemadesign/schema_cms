import * as Yup from 'yup';

export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
};

export const AUTH_METHODS = {
  EMAIL: 'email',
  GMAIL: 'gmail',
};

export const USER_PROFILE_FORM = 'user_profile_form';
export const FIRST_NAME = 'firstName';
export const LAST_NAME = 'lastName';
export const EMAIL = 'email';
export const ROLE = 'role';

export const INITIAL_VALUES = {
  [FIRST_NAME]: '',
  [LAST_NAME]: '',
  [EMAIL]: '',
};

export const USER_PROFILE_SCHEMA = Yup.object().shape({
  [FIRST_NAME]: Yup.string()
    .trim()
    .min(2, 'First name should be at least 2 characters')
    .max(50, 'First name should have maximum 50 characters'),
  [LAST_NAME]: Yup.string()
    .trim()
    .min(2, 'Last name should be at least 2 characters')
    .max(100, 'Last name should have maximum 100 characters')
    .required('Required'),
  [EMAIL]: Yup.string()
    .email('Invalid email format')
    .required('Required'),
});
