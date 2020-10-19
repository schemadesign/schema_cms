import { generateRandomString } from '../../../helpers/utils';

export const TAG_TEMPLATES = 'tagTemplates';
export const SINGLE = 'single';
export const MULTI = 'multi';
export const MIXED = 'mixed';
export const DATASET = 'dataset';
export const CONTENT = 'content';
export const AVAILABLE = 'available';
export const UNAVAILABLE = 'unavailable';
export const EXISTING = 'existing';

export const TAG_TEMPLATE_NAME_ERROR = {
  empty: 'Required',
  tooLong: 'Tag Category name should have maximum 100 characters',
  existing: 'A tag category with this name already exists in project.',
};

export const TAG_TEMPLATE_NAME_STATE = {
  tooLong: generateRandomString(101),
  empty: '',
};

export const TAG_NAME_ERROR = {
  tooLong: 'Tag should have maximum 150 characters',
  existing: 'TagTemplates must be unique',
};
