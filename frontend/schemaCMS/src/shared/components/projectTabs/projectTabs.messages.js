/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

import { DIRECTORY, SETTINGS, SOURCES, USERS } from './projectTabs.constants';

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
  [DIRECTORY]: {
    id: `shared.components.projectTabs.${DIRECTORY}`,
    defaultMessage: 'Pages Directory',
  },
});
