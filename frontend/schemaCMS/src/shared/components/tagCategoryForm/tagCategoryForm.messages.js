/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import { TAG_CATEGORY_NAME, TAG_CATEGORY_TAGS } from '../../../modules/tagCategory/tagCategory.constants';

export default defineMessages({
  [TAG_CATEGORY_NAME]: {
    id: `shared.components.tagCategoryForm.${TAG_CATEGORY_NAME}`,
    defaultMessage: 'Name',
  },
  [TAG_CATEGORY_TAGS]: {
    id: `shared.components.tagCategoryForm.${TAG_CATEGORY_TAGS}`,
    defaultMessage: 'Tags',
  },
  addTag: {
    id: 'shared.components.tagCategoryForm.addTag',
    defaultMessage: 'Add tag',
  },
  noTags: {
    id: 'shared.components.tagCategoryForm.noTags',
    defaultMessage: 'No Tags',
  },
  keyTagKeyNotUniqueError: {
    id: 'shared.components.tagCategoryForm.keyTagKeyNotUniqueError',
    defaultMessage: 'A tag with this name already exists in project.',
  },
});
