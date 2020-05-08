/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { TAG_NAME, TAG_TAGS } from '../../../modules/tagCategory/tagCategory.constants';

export default defineMessages({
  [TAG_NAME]: {
    id: `shared.components.projectTagForm.${TAG_NAME}`,
    defaultMessage: 'Name',
  },
  [TAG_TAGS]: {
    id: `shared.components.projectTagForm.${TAG_TAGS}`,
    defaultMessage: 'Tags',
  },
  addTag: {
    id: 'shared.components.projectTagForm.addTag',
    defaultMessage: 'Add tag',
  },
  noTags: {
    id: 'shared.components.projectTagForm.noTags',
    defaultMessage: 'No Tags',
  },
  keyTagKeyNotUniqueError: {
    id: 'shared.components.projectTagForm.keyTagKeyNotUniqueError',
    defaultMessage: 'A tag with this name already exists in project.',
  },
});
