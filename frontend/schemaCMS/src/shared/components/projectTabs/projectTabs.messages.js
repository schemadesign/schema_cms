/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

import { FOLDER, SETTINGS, SOURCES, STATES, USERS } from './projectTabs.constants';

export default defineMessages({
  [SETTINGS]: {
    id: `shared.components.projectTabs.${SETTINGS}`,
    defaultMessage: 'Settings',
  },
  [SOURCES]: {
    id: `shared.components.projectTabs.${SOURCES}`,
    defaultMessage: 'Sources',
  },
  [USERS]: {
    id: `shared.components.projectTabs.${USERS}`,
    defaultMessage: 'Users',
  },
  [FOLDER]: {
    id: `shared.components.projectTabs.${FOLDER}`,
    defaultMessage: 'Pages',
  },
  [STATES]: {
    id: `shared.components.projectTabs.${STATES}`,
    defaultMessage: 'States',
  },
});
