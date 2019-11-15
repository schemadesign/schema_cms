import * as Yup from 'yup';
import { EMAIL, FIRST_NAME, LAST_NAME, ROLES } from '../userProfile/userProfile.constants';

export const USER_CREATE_CMS_FORM = 'user_create_cms_form';
export const USER_CREATE_PROJECT_FORM = 'user_create_project_form';

export const USER_ROLE = 'role';

export const NEW_USER_ROLES_OPTIONS = [
  { value: ROLES.ADMIN, label: 'Admin' },
  { value: ROLES.EDITOR, label: 'Editor' },
];

export const USER_CREATE_CMS_SCHEME = Yup.object().shape({
  [FIRST_NAME]: Yup.string()
    .min(2, 'Name should have at least 2 characters')
    .required('Required'),
  [LAST_NAME]: Yup.string()
    .min(2, 'Surname should have at least 2 characters')
    .required('Required'),
  [USER_ROLE]: Yup.string()
    .ensure()
    .required('Required'),
  [EMAIL]: Yup.string()
    .email('Invalid email')
    .required('Required'),
});

export const USER_CREATE_PROJECT_SCHEME = Yup.object().shape({
  [USER_ROLE]: Yup.string()
    .ensure()
    .required('Required'),
  [EMAIL]: Yup.string()
    .email('Invalid email')
    .required('Required'),
});
