import * as Yup from 'yup';

export const BLOCK_FORM = 'block_form';
export const BLOCK_NAME = 'name';
export const BLOCK_TYPE = 'type';
export const BLOCK_CONTENT = 'content';
export const BLOCK_IMAGE = 'image';

export const IMAGE_TYPE = 'image_uploaded';
export const MARKDOWN_TYPE = 'markdown_text';
export const EMBED_TYPE = 'youtube_embed';
export const CODE_TYPE = 'code_snippet';
export const NONE = 'none';

export const INITIAL_VALUES = {
  [BLOCK_NAME]: '',
  [`${MARKDOWN_TYPE}-${BLOCK_CONTENT}`]: '',
  [`${EMBED_TYPE}-${BLOCK_CONTENT}`]: '',
  [`${CODE_TYPE}-${BLOCK_CONTENT}`]: '',
  [BLOCK_IMAGE]: null,
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
