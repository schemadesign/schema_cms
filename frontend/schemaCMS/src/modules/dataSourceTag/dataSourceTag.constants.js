import * as Yup from 'yup';

export const TAG_NAME = 'name';
export const TAG_TAGS = 'tags';
export const TAG_REMOVE_TAGS = 'deleteTags';

export const INITIAL_VALUES = {
  [TAG_NAME]: '',
  [TAG_TAGS]: [''],
  [TAG_REMOVE_TAGS]: [],
};

export const TAGS_SCHEMA = Yup.object().shape({
  [TAG_NAME]: Yup.string()
    .trim()
    .min(1, 'Tag key should have at least 1 character')
    .max(25, 'Tag key should have maximum 25 characters')
    .required('Required'),
});
