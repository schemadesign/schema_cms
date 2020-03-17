import * as Yup from 'yup';

export const PAGE_NAME = 'name';
export const PAGE_DISPLAY_NAME = 'displayName';
export const PAGE_KEYWORDS = 'keywords';
export const PAGE_DESCRIPTION = 'description';
export const PAGE_TEMPLATE = 'template';

export const INITIAL_VALUES = {
  [PAGE_NAME]: '',
  [PAGE_DISPLAY_NAME]: '',
  [PAGE_KEYWORDS]: '',
  [PAGE_DESCRIPTION]: '',
  [PAGE_TEMPLATE]: '',
};

export const PAGE_SCHEMA = Yup.object().shape({
  [PAGE_NAME]: Yup.string()
    .trim()
    .min(1, 'Page Name should have at least 1 characters')
    .max(25, 'Page Name should have maximum 25 characters')
    .required('Required'),
});
