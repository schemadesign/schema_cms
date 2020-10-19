/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

import { CONTENT, SETTINGS, SOURCES, TAG_CATEGORIES, TEMPLATES, USERS } from './projectTabs.constants';

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
  [TEMPLATES]: {
    id: `shared.components.projectTabs.${TEMPLATES}`,
    defaultMessage: 'Templates',
  },
  [TAG_CATEGORIES]: {
    id: `shared.components.projectTabs.${TAG_CATEGORIES}`,
    defaultMessage: 'TagTemplates',
  },
});
