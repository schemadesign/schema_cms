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
    id: `shared.components.filterForm.${FILTER_NAME}`,
    defaultMessage: 'Filter Name',
  },
  [FILTER_FIELD]: {
    id: `shared.components.filterForm.${FILTER_FIELD}`,
    defaultMessage: 'Field',
  },
  [FILTER_FIELD_TYPE]: {
    id: `shared.components.filterForm.${FILTER_FIELD_TYPE}`,
    defaultMessage: 'Field Type',
  },
  [FILTER_TYPE]: {
    id: `shared.components.filterForm.${FILTER_TYPE}`,
    defaultMessage: 'Filter Type',
  },
  [FILTER_UNIQUE_ITEMS]: {
    id: `shared.components.filterForm.${FILTER_UNIQUE_ITEMS}`,
    defaultMessage: 'Unique items',
  },
  saveFilter: {
    id: 'shared.components.filterForm.saveFilter',
    defaultMessage: 'Save',
  },
  deleteFilter: {
    id: 'shared.components.filterForm.deleteFilter',
    defaultMessage: 'Remove filter',
  },
  cancel: {
    id: 'shared.components.filterForm.cancel',
    defaultMessage: 'Cancel',
  },
  back: {
    id: 'shared.components.filterForm.back',
    defaultMessage: 'Back',
  },
  cancelRemoval: {
    id: 'shared.components.filterForm.cancelRemoval',
    defaultMessage: 'Cancel',
  },
  confirmRemoval: {
    id: 'shared.components.filterForm.confirmRemoval',
    defaultMessage: 'Confirm',
  },
  removeTitle: {
    id: 'shared.components.filterForm.removeTitle',
    defaultMessage: 'Are you sure you want to remove the filter?',
  },
  nameFilterNameNotUniqueError: {
    id: 'shared.components.filterForm.nameFilterNameNotUniqueError',
    defaultMessage: 'A filter with this name already exists in project.',
  },
});
