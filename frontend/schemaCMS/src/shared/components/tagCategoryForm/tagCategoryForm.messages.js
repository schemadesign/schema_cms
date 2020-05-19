/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  TAG_CATEGORY_IS_AVAILABLE,
  TAG_CATEGORY_IS_SINGLE_SELECT,
  TAG_CATEGORY_NAME,
  TAG_CATEGORY_TAGS,
  TAG_CATEGORY_TYPE,
  OPTION_DATASET,
  OPTION_CONTENT,
} from '../../../modules/tagCategory/tagCategory.constants';

export default defineMessages({
  [TAG_CATEGORY_NAME]: {
    id: `shared.components.tagCategoryForm.${TAG_CATEGORY_NAME}`,
    defaultMessage: 'Name',
  },
  [TAG_CATEGORY_TYPE]: {
    id: `shared.components.tagCategoryForm.${TAG_CATEGORY_TYPE}`,
    defaultMessage: 'Applicable in',
  },
  [OPTION_DATASET]: {
    id: `shared.components.tagCategoryForm.${OPTION_DATASET}`,
    defaultMessage: 'Dataset',
  },
  [OPTION_CONTENT]: {
    id: `shared.components.tagCategoryForm.${OPTION_CONTENT}`,
    defaultMessage: 'Content',
  },
  [TAG_CATEGORY_TAGS]: {
    id: `shared.components.tagCategoryForm.${TAG_CATEGORY_TAGS}`,
    defaultMessage: 'Tag',
  },
  [TAG_CATEGORY_IS_AVAILABLE]: {
    id: `shared.components.tagCategoryForm.${TAG_CATEGORY_IS_AVAILABLE}`,
    defaultMessage: 'Make it Available',
  },
  [TAG_CATEGORY_IS_SINGLE_SELECT]: {
    id: `shared.components.tagCategoryForm.${TAG_CATEGORY_IS_SINGLE_SELECT}`,
    defaultMessage: 'Make it Single Choice',
  },
  tagCategoryAvailability: {
    id: 'shared.components.tagCategoryForm.tagCategoryAvailability',
    defaultMessage: 'This Tag Category is currently {negative}available for Editors',
  },
  tagCategorySingleChoice: {
    id: 'shared.components.tagCategoryForm.tagCategorySingleChoice',
    defaultMessage: 'This Tag Category is currently {type}',
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
});
