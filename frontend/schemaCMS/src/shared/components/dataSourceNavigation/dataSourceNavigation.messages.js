/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  FILTERS_PAGE,
  METADATA_PAGE,
  PREVIEW_PAGE,
  RESULT_PAGE,
  SOURCE_PAGE,
  STATES_PAGE,
  STEPS_PAGE,
  TAGS_PAGE,
} from '../../../modules/dataSource/dataSource.constants';

export default defineMessages({
  [SOURCE_PAGE]: {
    id: `shared.components.dataSourceNavigation.${SOURCE_PAGE}`,
    defaultMessage: 'Source',
  },
  [PREVIEW_PAGE]: {
    id: `shared.components.dataSourceNavigation.${PREVIEW_PAGE}`,
    defaultMessage: 'Fields',
  },
  [STEPS_PAGE]: {
    id: `shared.components.dataSourceNavigation.${STEPS_PAGE}`,
    defaultMessage: 'Steps',
  },
  [RESULT_PAGE]: {
    id: `shared.components.dataSourceNavigation.${RESULT_PAGE}`,
    defaultMessage: 'Results',
  },
  [TAGS_PAGE]: {
    id: `shared.components.dataSourceNavigation.${TAGS_PAGE}`,
    defaultMessage: 'Tags',
  },
  [FILTERS_PAGE]: {
    id: `shared.components.dataSourceNavigation.${FILTERS_PAGE}`,
    defaultMessage: 'Filters',
  },
  [METADATA_PAGE]: {
    id: `shared.components.dataSourceNavigation.${METADATA_PAGE}`,
    defaultMessage: 'Metadata',
  },
  [STATES_PAGE]: {
    id: `shared.components.dataSourceNavigation.${STATES_PAGE}`,
    defaultMessage: 'States',
  },
});
