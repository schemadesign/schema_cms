/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  PROJECT_STATE_FILTER_TYPE,
  PROJECT_STATE_FILTER_NAME,
  PROJECT_STATE_FILTER_FIELD,
  PROJECT_STATE_FILTER_VALUES,
} from '../../../modules/dataSourceState/dataSourceState.constants';

export default defineMessages({
  subTitle: {
    id: 'dataSourceState.stateFilter.subTitle',
    defaultMessage: 'Set Filter',
  },
  [PROJECT_STATE_FILTER_TYPE]: {
    id: `dataSourceState.stateFilter.${PROJECT_STATE_FILTER_TYPE}`,
    defaultMessage: 'Filter Type',
  },
  [PROJECT_STATE_FILTER_NAME]: {
    id: `dataSourceState.stateFilter.${PROJECT_STATE_FILTER_NAME}`,
    defaultMessage: 'Filter Name',
  },
  [PROJECT_STATE_FILTER_FIELD]: {
    id: `dataSourceState.stateFilter.${PROJECT_STATE_FILTER_FIELD}`,
    defaultMessage: 'Field',
  },
  [PROJECT_STATE_FILTER_VALUES]: {
    id: `dataSourceState.stateFilter.${PROJECT_STATE_FILTER_VALUES}`,
    defaultMessage: 'Value',
  },
  min: {
    id: 'dataSourceState.stateFilter.min',
    defaultMessage: 'Min',
  },
  max: {
    id: 'dataSourceState.stateFilter.max',
    defaultMessage: 'Max',
  },
  selectPlaceholder: {
    id: 'dataSourceState.stateFilter.selectPlaceholder',
    defaultMessage: 'Select value',
  },
  save: {
    id: 'dataSourceState.stateFilter.save',
    defaultMessage: 'Save',
  },
});
