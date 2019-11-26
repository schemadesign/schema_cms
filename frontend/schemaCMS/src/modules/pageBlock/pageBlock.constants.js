import * as Yup from 'yup';

export const BLOCK_FORM = 'block_form';
export const BLOCK_NAME = 'name';
export const BLOCK_TYPE = 'type';

export const IMAGE_TYPE = 'image';
export const MARKDOWN_TYPE = 'markdown';
export const EMBED_TYPE = 'embed';
export const CODE_TYPE = 'code-snippet';
export const NONE = 'none';

export const INITIAL_VALUES = {
  [BLOCK_NAME]: '',
  [BLOCK_TYPE]: NONE,
};

export const VALID_TYPE_OPTIONS = [IMAGE_TYPE, MARKDOWN_TYPE, EMBED_TYPE, CODE_TYPE];
export const BLOCK_SCHEMA = Yup.object().shape({
  [BLOCK_NAME]: Yup.string()
    .min(2, 'Block name should have at least 2 characters')
    .max(50, 'Block name should have maximum 50 characters')
    .required('Required'),
  [BLOCK_TYPE]: Yup.mixed().oneOf(VALID_TYPE_OPTIONS, 'This option is invalid.'),
});
