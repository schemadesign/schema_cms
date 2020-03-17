import * as Yup from 'yup';

export const PAGE_NAME = 'name';

export const INITIAL_VALUES = {
  [PAGE_NAME]: '',
};

export const PAGE_SCHEMA = Yup.object().shape({
  [PAGE_NAME]: Yup.string()
    .trim()
    .min(1, 'Page Name should have at least 1 characters')
    .max(25, 'Page Name should have maximum 25 characters')
    .required('Required'),
});
