import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { HELPER_LINK, LINK_ITEM } from '../menu/mobileMenu/mobileMenu.constants';
import messages from './desktopHeader.messages';
import { PROJECTS_ID, USERS_PAGE_ID } from '../../../routes/project/project.constants';

export const PRIMARY_OPTIONS = [
  {
    label: <FormattedMessage {...messages.project} />,
    to: '/project',
    page: 'project',
    id: PROJECTS_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN, ROLES.EDITOR],
  },
  {
    label: <FormattedMessage {...messages.users} />,
    to: '/user',
    page: 'user',
    id: USERS_PAGE_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN],
  },
];

export const SECONDARY_OPTIONS = [
  { label: <FormattedMessage {...messages.about} />, to: '/', id: 'aboutNavBtn', type: HELPER_LINK },
  { label: <FormattedMessage {...messages.api} />, to: '/', id: 'apiNavBtn', type: HELPER_LINK },
  { label: <FormattedMessage {...messages.repository} />, to: '/', id: 'repositoryNavBtn', type: HELPER_LINK },
];
