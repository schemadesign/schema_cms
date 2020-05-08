import * as Yup from 'yup';
import { any, complement, propEq } from 'ramda';

export const TAG_CATEGORY_FORM = 'tag_category_form';
export const TAG_CATEGORY_NAME = 'name';
export const TAG_CATEGORY_TAGS = 'tags';
export const TAG_CATEGORY_REMOVE_TAGS = 'deleteTags';

export const INITIAL_VALUES = {
  [TAG_CATEGORY_NAME]: '',
  [TAG_CATEGORY_TAGS]: [],
  [TAG_CATEGORY_REMOVE_TAGS]: [],
};

export const TAG_CATEGORY_SCHEMA = Yup.object().shape({
  [TAG_CATEGORY_NAME]: Yup.string()
    .trim()
    .min(1, 'Tag Category name should have at least 1 character')
    .max(25, 'Tag Category name should have maximum 25 characters')
    .required('Required'),
  [TAG_CATEGORY_TAGS]: Yup.array()
    .test('emptyElement', 'Item can`t be empty', complement(any(propEq('value', ''))))
    .required('Required'),
});
