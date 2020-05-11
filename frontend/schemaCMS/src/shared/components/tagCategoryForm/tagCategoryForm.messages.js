/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  TAG_CATEGORY_IS_PUBLIC,
  TAG_CATEGORY_IS_SINGLE_SELECT,
  TAG_CATEGORY_NAME,
  TAG_CATEGORY_TAGS,
} from '../../../modules/tagCategory/tagCategory.constants';

export default defineMessages({
  [TAG_CATEGORY_NAME]: {
    id: `shared.components.tagCategoryForm.${TAG_CATEGORY_NAME}`,
    defaultMessage: 'Name',
  },
  [TAG_CATEGORY_TAGS]: {
    id: `shared.components.tagCategoryForm.${TAG_CATEGORY_TAGS}`,
    defaultMessage: 'Tag',
  },
  [TAG_CATEGORY_IS_PUBLIC]: {
    id: `shared.components.tagCategoryForm.${TAG_CATEGORY_IS_PUBLIC}`,
    defaultMessage: 'Make it Public',
  },
  [TAG_CATEGORY_IS_SINGLE_SELECT]: {
    id: `shared.components.tagCategoryForm.${TAG_CATEGORY_IS_SINGLE_SELECT}`,
    defaultMessage: 'Make it Single Choice',
  },
  tagCategoryAvailability: {
    id: 'shared.components.tagCategoryForm.tagCategoryAvailability',
    defaultMessage: 'This Tag Category is currently {availability}',
  },
  tagCategorySingleChoice: {
    id: 'shared.components.tagCategoryForm.tagCategorySingleChoice',
    defaultMessage: 'This Tag Category is currently {type}',
  },
  privateCopy: {
    id: 'shared.components.tagCategoryForm.privateCopy',
    defaultMessage: 'Private',
  },
  publicCopy: {
    id: 'shared.components.tagCategoryForm.publicCopy',
    defaultMessage: 'Public',
  },
  singleChoice: {
    id: 'shared.components.tagCategoryForm.singleChoice',
    defaultMessage: 'Single Choice',
  },
  multiChoice: {
    id: 'shared.components.tagCategoryForm.multiChoice',
    defaultMessage: 'Multi Choice',
  },
  addTag: {
    id: 'shared.components.tagCategoryForm.addTag',
    defaultMessage: 'Add tag',
  },
  addNewTag: {
    id: 'shared.components.tagCategoryForm.addNewTag',
    defaultMessage: 'Tap or click to add new Tag',
  },
  keyTagKeyNotUniqueError: {
    id: 'shared.components.tagCategoryForm.keyTagKeyNotUniqueError',
    defaultMessage: 'A tag category with this name already exists in project.',
  },
});
