/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  PROJECT_STATE_SOURCE_URL,
  PROJECT_STATE_DATA_SOURCE,
  PROJECT_STATE_DESCRIPTION,
  PROJECT_STATE_NAME,
  PROJECT_STATE_AUTHOR,
  PROJECT_STATE_CREATED,
  PROJECT_STATE_IS_PUBLIC,
} from '../../../modules/projectState/projectState.constants';

export default defineMessages({
  [PROJECT_STATE_DATA_SOURCE]: {
    id: `shared.components.projectStateForm.${[PROJECT_STATE_DATA_SOURCE]}`,
    defaultMessage: 'Dataset',
  },
  dataSourcePlaceholder: {
    id: 'shared.components.projectStateForm.dataSourcePlaceholder',
    defaultMessage: 'Select a dataset',
  },
  [PROJECT_STATE_NAME]: {
    id: `shared.components.projectStateForm.${[PROJECT_STATE_NAME]}`,
    defaultMessage: 'Name',
  },
  [PROJECT_STATE_DESCRIPTION]: {
    id: `shared.components.projectStateForm.${[PROJECT_STATE_DESCRIPTION]}`,
    defaultMessage: 'Description',
  },
  [PROJECT_STATE_SOURCE_URL]: {
    id: `shared.components.projectStateForm.${[PROJECT_STATE_SOURCE_URL]}`,
    defaultMessage: 'Source URL',
  },
  [PROJECT_STATE_AUTHOR]: {
    id: `shared.components.projectStateForm.${[PROJECT_STATE_AUTHOR]}`,
    defaultMessage: 'Author',
  },
  [PROJECT_STATE_CREATED]: {
    id: `shared.components.projectStateForm.${[PROJECT_STATE_CREATED]}`,
    defaultMessage: 'Created',
  },
  [PROJECT_STATE_IS_PUBLIC]: {
    id: `shared.components.projectStateForm.${[PROJECT_STATE_IS_PUBLIC]}`,
    defaultMessage: 'Make Public',
  },
});
