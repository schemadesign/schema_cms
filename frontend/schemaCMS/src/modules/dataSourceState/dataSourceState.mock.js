import {
  PROJECT_STATE_AUTHOR,
  PROJECT_STATE_CREATED,
  PROJECT_STATE_DESCRIPTION,
  PROJECT_STATE_IS_PUBLIC,
  PROJECT_STATE_NAME,
} from './dataSourceState.constants';

export const state = {
  [PROJECT_STATE_IS_PUBLIC]: false,
  [PROJECT_STATE_NAME]: 'name',
  [PROJECT_STATE_DESCRIPTION]: 'description',
  [PROJECT_STATE_AUTHOR]: 'author',
  [PROJECT_STATE_CREATED]: '10.12.2019',
  project: 1,
};
