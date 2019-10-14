import * as Yup from 'yup';
import { EMAIL, ROLES } from '../userProfile/userProfile.constants';

export const USER_CREATE_CMS_FORM = 'user_create_cms_form';
export const USER_CREATE_PROJECT_FORM = 'user_create_project_form';

export const USER_ROLE = 'role';

export const NEW_USER_ROLES_OPTIONS = [
  { value: ROLES.ADMIN, label: 'Admin' },
  { value: ROLES.EDITOR, label: 'Editor' },
];

export const USER_CREATE_CMS_SCHEME = Yup.object().shape({
  [USER_ROLE]: Yup.string()
    .ensure()
    .required('Required'),
  [EMAIL]: Yup.string()
    .email('Invalid email')
    .notRequired(),
});

export const USER_CREATE_PROJECT_SCHEME = Yup.object().shape({
  [USER_ROLE]: Yup.string()
    .ensure()
    .required('Required'),
  [EMAIL]: Yup.string()
    .email('Invalid email')
    .notRequired(),
});
