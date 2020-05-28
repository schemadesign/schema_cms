/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { DATA_SOURCE_STATE_FILTERS } from '../../../modules/dataSourceState/dataSourceState.constants';

export default defineMessages({
  subTitle: {
    id: 'dataSourceState.stateFilterList.subTitle',
    defaultMessage: 'Select Filters',
  },
  finish: {
    id: 'dataSourceState.stateFilterList.finish',
    defaultMessage: 'Finish',
  },
  noData: {
    id: 'dataSourceState.stateFilterList.noData',
    defaultMessage: 'No Filters',
  },
  [DATA_SOURCE_STATE_FILTERS]: {
    id: `shared.components.dataSourceStateForm.${[DATA_SOURCE_STATE_FILTERS]}`,
    defaultMessage: 'Filters',
  },
});
