import { FormattedMessage } from 'react-intl';
import React from 'react';

import messages from './dataWranglingScript.messages';
import { LINK_ITEM } from '../../shared/components/menu/mobileMenu/mobileMenu.constants';
import { ROLES } from '../../modules/userProfile/userProfile.constants';

export const PROJECTS_ID = 'projectsNavBtn';

export const DATA_WRANGLING_SCRIPT_MENU_OPTIONS = [
  {
    label: <FormattedMessage {...messages.projectsListPage} />,
    to: '/project/',
    id: PROJECTS_ID,
    type: LINK_ITEM,
    allowedRoles: [ROLES.ADMIN, ROLES.EDITOR],
  },
];
