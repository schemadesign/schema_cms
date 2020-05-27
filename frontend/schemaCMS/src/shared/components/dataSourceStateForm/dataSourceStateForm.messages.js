/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  DATA_SOURCE_STATE_SOURCE_URL,
  DATA_SOURCE_STATE_DESCRIPTION,
  DATA_SOURCE_STATE_NAME,
  DATA_SOURCE_STATE_AUTHOR,
  DATA_SOURCE_STATE_CREATED,
} from '../../../modules/dataSourceState/dataSourceState.constants';

export default defineMessages({
  dataSourcePlaceholder: {
    id: 'shared.components.dataSourceStateForm.dataSourcePlaceholder',
    defaultMessage: 'Select a dataset',
  },
  [DATA_SOURCE_STATE_NAME]: {
    id: `shared.components.dataSourceStateForm.${[DATA_SOURCE_STATE_NAME]}`,
    defaultMessage: 'Name',
  },
  [DATA_SOURCE_STATE_DESCRIPTION]: {
    id: `shared.components.dataSourceStateForm.${[DATA_SOURCE_STATE_DESCRIPTION]}`,
    defaultMessage: 'Description',
  },
  [DATA_SOURCE_STATE_SOURCE_URL]: {
    id: `shared.components.dataSourceStateForm.${[DATA_SOURCE_STATE_SOURCE_URL]}`,
    defaultMessage: 'Source URL',
  },
  [DATA_SOURCE_STATE_AUTHOR]: {
    id: `shared.components.dataSourceStateForm.${[DATA_SOURCE_STATE_AUTHOR]}`,
    defaultMessage: 'Author',
  },
  [DATA_SOURCE_STATE_CREATED]: {
    id: `shared.components.dataSourceStateForm.${[DATA_SOURCE_STATE_CREATED]}`,
    defaultMessage: 'Created',
  },
});
