/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  DATA_SOURCE_STATE_FILTER_TYPE,
  DATA_SOURCE_STATE_FILTER_NAME,
  DATA_SOURCE_STATE_FILTER_FIELD,
  DATA_SOURCE_STATE_FILTER_VALUES,
} from '../../../modules/dataSourceState/dataSourceState.constants';

export default defineMessages({
  subTitle: {
    id: 'dataSourceState.stateFilter.subTitle',
    defaultMessage: 'Set Filter',
  },
  [DATA_SOURCE_STATE_FILTER_TYPE]: {
    id: `dataSourceState.stateFilter.${DATA_SOURCE_STATE_FILTER_TYPE}`,
    defaultMessage: 'Filter Type',
  },
  [DATA_SOURCE_STATE_FILTER_NAME]: {
    id: `dataSourceState.stateFilter.${DATA_SOURCE_STATE_FILTER_NAME}`,
    defaultMessage: 'Filter Name',
  },
  [DATA_SOURCE_STATE_FILTER_FIELD]: {
    id: `dataSourceState.stateFilter.${DATA_SOURCE_STATE_FILTER_FIELD}`,
    defaultMessage: 'Field',
  },
  [DATA_SOURCE_STATE_FILTER_VALUES]: {
    id: `dataSourceState.stateFilter.${DATA_SOURCE_STATE_FILTER_VALUES}`,
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
