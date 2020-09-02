import * as Yup from 'yup';

export const SECTIONS_NAME = 'name';
export const SECTIONS_PUBLISH = 'isPublic';
export const SECTIONS_MAIN_PAGE = 'mainPage';
export const SECTIONS_RSS = 'isRssEnabled';

export const INITIAL_VALUES = {
  [SECTIONS_NAME]: '',
};

export const SECTIONS_SCHEMA = Yup.object().shape({
  [SECTIONS_NAME]: Yup.string()
    .trim()
    .min(1, 'Section Name should have at least 1 character')
    .max(100, 'Section Name should have maximum 100 characters')
    .required('Required'),
});
