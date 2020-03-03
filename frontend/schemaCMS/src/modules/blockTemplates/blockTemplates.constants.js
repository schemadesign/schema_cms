import * as Yup from 'yup';

export const BLOCK_TEMPLATES_NAME = 'name';

export const INITIAL_VALUES = {
  [BLOCK_TEMPLATES_NAME]: '',
};

export const BLOCK_TEMPLATES_SCHEMA = Yup.object().shape({
  [BLOCK_TEMPLATES_NAME]: Yup.string()
    .trim()
    .min(3, 'Block Template Name should have at least 3 characters')
    .max(25, 'Block Template Name should have maximum 25 characters')
    .required('Required'),
});
