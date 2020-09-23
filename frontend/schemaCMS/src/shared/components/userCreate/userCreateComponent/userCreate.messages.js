/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  invite: {
    id: 'userCreate.invite',
    defaultMessage: 'Invite',
  },
  add: {
    id: 'userCreate.add',
    defaultMessage: 'Add',
  },
  cancel: {
    id: 'userCreate.cancel',
    defaultMessage: 'Cancel',
  },
  pageTitle: {
    id: 'userCreate.pageTitle',
    defaultMessage: 'Users',
  },
  pageSubTitle: {
    id: 'userCreate.pageSubTitle',
    defaultMessage: 'Invite a User to Schema CMS',
  },
  addUser: {
    id: 'userCreate.addUser',
    defaultMessage: 'You are adding {user} to {project}',
  },
  emailAuth0UserAlreadyExistError: {
    id: 'userCreate.0Auth0UserAlreadyExistError',
    defaultMessage: 'A user with this email already exists in Schema CMS.',
  },
  emailOktaUserNotExistError: {
    id: 'userCreate.emailOktaUserNotExistError',
    defaultMessage:
      'The email is not present in Okta Identity Cloud. Please contact your administrator for more details.',
  },
  emailUniqueError: {
    id: 'userCreate.emailUniqueError',
    defaultMessage: 'A user with this email already exists in Schema CMS.',
  },
});
