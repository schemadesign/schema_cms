import {
  DATA_SOURCE_STATE_AUTHOR,
  DATA_SOURCE_STATE_CREATED,
  DATA_SOURCE_STATE_DESCRIPTION,
  DATA_SOURCE_STATE_IS_PUBLIC,
  DATA_SOURCE_STATE_NAME,
} from './dataSourceState.constants';

export const state = {
  [DATA_SOURCE_STATE_IS_PUBLIC]: false,
  [DATA_SOURCE_STATE_NAME]: 'name',
  [DATA_SOURCE_STATE_DESCRIPTION]: 'description',
  [DATA_SOURCE_STATE_AUTHOR]: 'author',
  [DATA_SOURCE_STATE_CREATED]: '2020-05-27T12:49:08+0000',
  project: 1,
};
