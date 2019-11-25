import * as Yup from 'yup';

export const PAGE_FORM = 'page_form';
export const PAGE_TITLE = 'title';
export const PAGE_DESCRIPTION = 'description';
export const PAGE_KEYWORDS = 'keywords';

export const INITIAL_VALUES = {
  [PAGE_TITLE]: '',
  [PAGE_DESCRIPTION]: '',
  [PAGE_KEYWORDS]: '',
};

export const PAGE_SCHEMA = Yup.object().shape({
  [PAGE_TITLE]: Yup.string()
    .min(2, 'Page Title should have at least 2 characters')
    .max(50, 'Page Title should have maximum 50 characters')
    .required('Required'),
  [PAGE_DESCRIPTION]: Yup.string().max(500, 'Page description should have maximum 500 characters'),
  [PAGE_KEYWORDS]: Yup.string().max(500, 'Page Keywords should have maximum 500 characters'),
});
