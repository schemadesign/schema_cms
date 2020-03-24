import * as Yup from 'yup';

export const PAGE_NAME = 'name';
export const PAGE_DISPLAY_NAME = 'displayName';
export const PAGE_KEYWORDS = 'keywords';
export const PAGE_DESCRIPTION = 'description';
export const PAGE_TEMPLATE = 'template';
export const PAGE_IS_PUBLIC = 'isPublic';
export const PAGE_BLOCKS = 'blocks';
export const PAGE_DELETE_BLOCKS = 'deleteBlocks';

export const BLOCK_NAME = 'name';
export const BLOCK_TYPE = 'type';
export const BLOCK_KEY = 'key';
export const BLOCK_ID = 'id';

export const FORM_VALUES = [
  PAGE_NAME,
  PAGE_DISPLAY_NAME,
  PAGE_KEYWORDS,
  PAGE_DESCRIPTION,
  PAGE_TEMPLATE,
  PAGE_BLOCKS,
  PAGE_IS_PUBLIC,
];

export const INITIAL_VALUES = {
  [PAGE_NAME]: '',
  [PAGE_DISPLAY_NAME]: '',
  [PAGE_KEYWORDS]: '',
  [PAGE_DESCRIPTION]: '',
  [PAGE_TEMPLATE]: '',
  [PAGE_BLOCKS]: [],
  [PAGE_DELETE_BLOCKS]: [],
  [PAGE_IS_PUBLIC]: false,
};

export const PAGE_SCHEMA = Yup.object().shape({
  [PAGE_NAME]: Yup.string()
    .trim()
    .min(1, 'Page Name should have at least 1 characters')
    .max(25, 'Page Name should have maximum 25 characters')
    .required('Required'),
  [PAGE_DISPLAY_NAME]: Yup.string()
    .trim()
    .max(25, 'Page URL Display Name should have maximum 25 characters'),
  [PAGE_DESCRIPTION]: Yup.string()
    .trim()
    .max(1000, 'Page Description should have maximum 1000 characters'),
  [PAGE_KEYWORDS]: Yup.string()
    .trim()
    .max(1000, 'Page Keywords should have maximum 1000 characters'),
  [PAGE_TEMPLATE]: Yup.string()
    .min(1, 'Required')
    .required('Required'),
});
