import * as Yup from 'yup';

export const PAGE_TEMPLATES_NAME = 'name';
export const PAGE_TEMPLATES_BLOCKS = 'blocks';
export const PAGE_TEMPLATES_IS_AVAILABLE = 'isAvailable';
export const PAGE_TEMPLATES_ALLOW_ADD = 'allowAdd';

export const getDefaultPageBlock = () => ({});

export const INITIAL_VALUES = {
  [PAGE_TEMPLATES_NAME]: '',
  [PAGE_TEMPLATES_BLOCKS]: [],
  [PAGE_TEMPLATES_IS_AVAILABLE]: false,
  [PAGE_TEMPLATES_ALLOW_ADD]: false,
};

export const PAGE_TEMPLATES_SCHEMA = Yup.object().shape({
  [PAGE_TEMPLATES_NAME]: Yup.string()
    .trim()
    .min(3, 'Page Template Name should have at least 3 characters')
    .max(25, 'Page Template Name should have maximum 25 characters')
    .required('Required'),
});
