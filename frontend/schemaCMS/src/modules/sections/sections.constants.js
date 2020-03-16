import * as Yup from 'yup';

export const SECTIONS_NAME = 'sections';

export const INITIAL_VALUES = {
  [SECTIONS_NAME]: '',
};

export const SECTIONS_SCHEMA = Yup.object().shape({
  [SECTIONS_NAME]: Yup.string()
    .trim()
    .min(3, 'Section Name should have at least 3 characters')
    .max(25, 'Section Name should have maximum 25 characters')
    .required('Required'),
});
