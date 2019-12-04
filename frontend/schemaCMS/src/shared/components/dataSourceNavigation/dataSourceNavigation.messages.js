/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  FILTERS_PAGE,
  PREVIEW_PAGE,
  RESULT_PAGE,
  SOURCE_PAGE,
  STEPS_PAGE,
  VIEWS_PAGE,
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
  [VIEWS_PAGE]: {
    id: `shared.components.dataSourceNavigation.${VIEWS_PAGE}`,
    defaultMessage: 'Views',
  },
  [FILTERS_PAGE]: {
    id: `shared.components.dataSourceNavigation.${FILTERS_PAGE}`,
    defaultMessage: 'Filters',
  },
});