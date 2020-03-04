import * as Yup from 'yup';

export const BLOCK_TEMPLATES_NAME = 'name';
export const BLOCK_TEMPLATES_ELEMENTS = 'elements';

export const RICH_TEXT_TYPE = 'rich_text';
export const PLAIN_TEXT_TYPE = 'plain_text';

export const INITIAL_VALUES = {
  [BLOCK_TEMPLATES_NAME]: '',
  [BLOCK_TEMPLATES_ELEMENTS]: [],
};

export const BLOCK_TEMPLATE_DEFAULT_ELEMENT = {
  type: RICH_TEXT_TYPE,
  name: '',
  params: {},
};

export const BLOCK_TEMPLATES_SCHEMA = Yup.object().shape({
  [BLOCK_TEMPLATES_NAME]: Yup.string()
    .trim()
    .min(3, 'Block Template Name should have at least 3 characters')
    .max(25, 'Block Template Name should have maximum 25 characters')
    .required('Required'),
});
