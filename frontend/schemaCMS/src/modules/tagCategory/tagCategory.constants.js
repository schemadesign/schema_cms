import * as Yup from 'yup';
import { filter, gte, pipe, length, propEq } from 'ramda';

export const TAG_CATEGORY_FORM = 'tag_category_form';
export const TAG_CATEGORY_NAME = 'name';
export const TAG_CATEGORY_TYPE = 'type';
export const TAG_CATEGORY_TAGS = 'tags';
export const TAG_CATEGORY_REMOVE_TAGS = 'deleteTags';
export const TAG_CATEGORY_IS_AVAILABLE = 'isAvailable';
export const TAG_CATEGORY_IS_SINGLE_SELECT = 'isSingleSelect';

export const OPTION_CONTENT = 'content';
export const OPTION_DATASET = 'dataset';

export const INITIAL_VALUES = {
  [TAG_CATEGORY_NAME]: '',
  [TAG_CATEGORY_TYPE]: {
    [OPTION_CONTENT]: false,
    [OPTION_DATASET]: false,
  },
  [TAG_CATEGORY_TAGS]: [],
  [TAG_CATEGORY_IS_AVAILABLE]: false,
  [TAG_CATEGORY_IS_SINGLE_SELECT]: false,
};

export const TAG_CATEGORY_SCHEMA = Yup.object().shape({
  [TAG_CATEGORY_NAME]: Yup.string()
    .trim()
    .min(1, 'Tag Category name should have at least 1 character')
    .max(100, 'Tag Category name should have maximum 100 characters')
    .required('Required'),
  [TAG_CATEGORY_TAGS]: Yup.array()
    .of(
      Yup.object()
        .shape({
          value: Yup.string()
            .trim()
            .min(1, 'Tag should have at least 1 character')
            .max(150, 'Tag should have maximum 150 characters'),
        })
        .test('unique', 'TagTemplates must be unique', function({ value }) {
          // eslint-disable-next-line babel/no-invalid-this
          const { parent } = this;
          return pipe(
            filter(propEq('value', value)),
            length,
            gte(1)
          )(parent);
        })
    )
    .min(1, 'Required'),
});
