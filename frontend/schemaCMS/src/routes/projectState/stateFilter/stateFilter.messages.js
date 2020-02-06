/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  PROJECT_STATE_FILTER_TYPE,
  PROJECT_STATE_FILTER_NAME,
  PROJECT_STATE_FILTER_FIELD,
  PROJECT_STATE_FILTER_VALUES,
} from '../../../modules/projectState/projectState.constants';

export default defineMessages({
  subTitle: {
    id: 'projectState.stateFilter.subTitle',
    defaultMessage: 'Set Filter',
  },
  [PROJECT_STATE_FILTER_TYPE]: {
    id: `projectState.stateFilter.${PROJECT_STATE_FILTER_TYPE}`,
    defaultMessage: 'Filter Type',
  },
  [PROJECT_STATE_FILTER_NAME]: {
    id: `projectState.stateFilter.${PROJECT_STATE_FILTER_NAME}`,
    defaultMessage: 'Filter Name',
  },
  [PROJECT_STATE_FILTER_FIELD]: {
    id: `projectState.stateFilter.${PROJECT_STATE_FILTER_FIELD}`,
    defaultMessage: 'Field',
  },
  [PROJECT_STATE_FILTER_VALUES]: {
    id: `projectState.stateFilter.${PROJECT_STATE_FILTER_VALUES}`,
    defaultMessage: 'Value',
  },
  min: {
    id: 'projectState.stateFilter.min',
    defaultMessage: 'Min',
  },
  max: {
    id: 'projectState.stateFilter.max',
    defaultMessage: 'Max',
  },
  selectPlaceholder: {
    id: 'projectState.stateFilter.selectPlaceholder',
    defaultMessage: 'Select value',
  },
  save: {
    id: 'projectState.stateFilter.save',
    defaultMessage: 'Save',
  },
});
