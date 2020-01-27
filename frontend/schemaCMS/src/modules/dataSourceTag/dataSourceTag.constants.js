import * as Yup from 'yup';

export const TAG_KEY = 'key';
export const TAG_VALUE = 'value';

export const INITIAL_VALUES = {
  [TAG_KEY]: '',
  [TAG_VALUE]: '',
};

export const TAGS_SCHEMA = Yup.object().shape({
  [TAG_KEY]: Yup.string()
    .trim()
    .min(1, 'Tag name should have at least 3 characters')
    .max(25, 'Tag name should have maximum 25 characters')
    .required('Required'),
  [TAG_VALUE]: Yup.string()
    .trim()
    .min(1, 'Tag name should have at least 3 characters')
    .max(150, 'Tag name should have maximum 25 characters')
    .required('Required'),
});
