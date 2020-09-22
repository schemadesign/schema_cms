import { generateRandomString } from '../../helpers/utils';

export const DJANGO = 'django';
export const DJANGO_FIRST_NAME = {
  invitedAdmin: process.env.DJANGO_FIRST_NAME_ADMIN,
  invitedEditor: process.env.DJANGO_FIRST_NAME_EDITOR,
  existingAdmin: process.env.DJANGO_FIRST_NAME_ADMIN,
};
export const DJANGO_ADMIN_LAST_NAME = `${generateRandomString(5)}`;
export const DJANGO_EDITOR_LAST_NAME = `${generateRandomString(5)}`;
export const USER_STATUS = {
  active: 'True',
  inactive: 'False',
};
export const DJANGO_SUCCESSFUL_INVITATION_MSG = role =>
  `The user "${DJANGO_FIRST_NAME[role]} ${process.env.DJANGO_LAST_NAME}" was added successfully. You may edit it again below.`;
export const DJANGO_ADMIN_ROLE = 'adminRole';
export const DJANGO_EDITOR_ROLE = 'editorRole';
