/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { TAG_NAME, TAG_TAGS } from '../../../modules/dataSourceTag/dataSourceTag.constants';

export default defineMessages({
  [TAG_NAME]: {
    id: `shared.components.dataSourceTagForm.${TAG_NAME}`,
    defaultMessage: 'Name',
  },
  [TAG_TAGS]: {
    id: `shared.components.dataSourceTagForm.${TAG_TAGS}`,
    defaultMessage: 'Tags',
  },
  addTag: {
    id: 'shared.components.dataSourceTagForm.addTag',
    defaultMessage: 'Add tag',
  },
  keyTagKeyNotUniqueError: {
    id: 'shared.components.dataSourceTagForm.keyTagKeyNotUniqueError',
    defaultMessage: 'A tag with this name already exists in data source.',
  },
});
