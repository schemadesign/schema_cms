/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { DATA_SOURCE_STATE_TAGS } from '../../modules/dataSourceState/dataSourceState.constants';

export default defineMessages({
  subTitle: {
    id: 'dataSourceState.subTitle',
    defaultMessage: 'Edit State',
  },
  back: {
    id: 'dataSourceState.back',
    defaultMessage: 'Back',
  },
  deleteState: {
    id: 'dataSourceState.deleteState',
    defaultMessage: 'Remove State',
  },
  confirmRemoval: {
    id: 'dataSourceState.confirmRemoval',
    defaultMessage: 'Confirm',
  },
  removeTitle: {
    id: 'dataSourceState.removeTitle',
    defaultMessage: 'Are you sure you want to remove this state?',
  },
  cancelRemoval: {
    id: 'dataSourceState.cancelRemoval',
    defaultMessage: 'Cancel',
  },
  save: {
    id: 'dataSourceState.save',
    defaultMessage: 'Save',
  },
  nameStateNameNotUniqueError: {
    id: 'dataSourceState.nameStateNameNotUniqueError',
    defaultMessage: 'A state with this name already exists in data source.',
  },
  [DATA_SOURCE_STATE_TAGS]: {
    id: `dataSourceState.${DATA_SOURCE_STATE_TAGS}`,
    defaultMessage: 'Tags',
  },
});
