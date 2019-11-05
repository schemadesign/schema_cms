/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  FILTER_NAME,
  FILTER_FIELD,
  FILTER_FIELD_TYPE,
  FILTER_TYPE,
  FILTER_UNIQUE_ITEMS,
} from '../../../modules/filter/filter.constants';

export default defineMessages({
  [FILTER_NAME]: {
    id: `shared.components.filter.${FILTER_NAME}`,
    defaultMessage: 'Filter Name',
  },
  [FILTER_FIELD]: {
    id: `shared.components.filter.${FILTER_FIELD}`,
    defaultMessage: 'Field',
  },
  [FILTER_FIELD_TYPE]: {
    id: `shared.components.filter.${FILTER_FIELD_TYPE}`,
    defaultMessage: 'Field Type',
  },
  [FILTER_TYPE]: {
    id: `shared.components.filter.${FILTER_TYPE}`,
    defaultMessage: 'Filter Type',
  },
  [FILTER_UNIQUE_ITEMS]: {
    id: `shared.components.filter.${FILTER_UNIQUE_ITEMS}`,
    defaultMessage: 'Unique items',
  },
});
