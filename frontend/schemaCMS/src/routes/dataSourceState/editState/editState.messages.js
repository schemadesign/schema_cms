/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { DATA_SOURCE_STATE_IS_PUBLIC } from '../../../modules/dataSourceState/dataSourceState.constants';

export default defineMessages({
  subTitle: {
    id: 'dataSourceState.editState.subTitle',
    defaultMessage: 'Edit State',
  },
  back: {
    id: 'dataSourceState.editState.back',
    defaultMessage: 'Back',
  },
  deleteState: {
    id: 'dataSourceState.editState.deleteState',
    defaultMessage: 'Remove State',
  },
  confirmRemoval: {
    id: 'dataSourceState.editState.confirmRemoval',
    defaultMessage: 'Confirm',
  },
  removeTitle: {
    id: 'dataSourceState.editState.removeTitle',
    defaultMessage: 'Are you sure you want to remove this state?',
  },
  cancelRemoval: {
    id: 'dataSourceState.editState.cancelRemoval',
    defaultMessage: 'Cancel',
  },
  save: {
    id: 'dataSourceState.editState.save',
    defaultMessage: 'Save',
  },
  nameStateNameNotUniqueError: {
    id: 'dataSourceState.editState.nameStateNameNotUniqueError',
    defaultMessage: 'A state with this name already exists in data source.',
  },
  [DATA_SOURCE_STATE_IS_PUBLIC]: {
    id: `shared.components.dataSourceStateForm.${[DATA_SOURCE_STATE_IS_PUBLIC]}`,
    defaultMessage: 'Make Public',
  },
});
