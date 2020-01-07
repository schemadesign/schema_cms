/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'revokedAccess.pageTitle',
    defaultMessage: 'Revoked access',
  },
  info: {
    id: 'revokedAccess.info',
    defaultMessage: 'Access for account with email <b>{email}</b> has been revoked.',
  },
  contact: {
    id: 'revokedAccess.contact',
    defaultMessage:
      'If you believe this is an error, please contact your administrator or <a href="/">log with different credentials</a>.',
  },
});
