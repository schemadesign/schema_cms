/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

import { CONTENT, SETTINGS, SOURCES, STATES, TAGS, TEMPLATES, USERS } from './projectTabs.constants';

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
  [CONTENT]: {
    id: `shared.components.projectTabs.${CONTENT}`,
    defaultMessage: 'Content',
  },
  [STATES]: {
    id: `shared.components.projectTabs.${STATES}`,
    defaultMessage: 'States',
  },
  [TEMPLATES]: {
    id: `shared.components.projectTabs.${TEMPLATES}`,
    defaultMessage: 'Templates',
  },
  [TAGS]: {
    id: `shared.components.projectTabs.${TAGS}`,
    defaultMessage: 'Tags',
  },
});
