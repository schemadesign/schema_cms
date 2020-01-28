import * as Yup from 'yup';

export const BLOCK_FORM = 'block_form';
export const BLOCK_NAME = 'name';
export const BLOCK_TYPE = 'type';
export const BLOCK_CONTENT = 'content';
export const BLOCK_INPUT_IMAGES = 'inputImages';
export const BLOCK_IMAGES = 'images';
export const BLOCK_IMAGE_NAMES = 'imageNames';
export const BLOCK_DELETE_IMAGES = 'deleteImages';

export const IMAGE_TYPE = 'image';
export const MARKDOWN_TYPE = 'markdown';
export const TEXT_TYPE = 'text';
export const EMBED_TYPE = 'embed';
export const CODE_TYPE = 'code';
export const NONE = 'none';

const CONTENT_OPTIONS = [MARKDOWN_TYPE, TEXT_TYPE, EMBED_TYPE, CODE_TYPE];
export const VALID_TYPE_OPTIONS = [IMAGE_TYPE, ...CONTENT_OPTIONS];

export const INITIAL_VALUES = {
  [BLOCK_NAME]: '',
  ...CONTENT_OPTIONS.reduce((prev, current) => ({ ...prev, [`${current}-${BLOCK_CONTENT}`]: '' }), {}),
  [BLOCK_IMAGES]: [],
  [BLOCK_INPUT_IMAGES]: [],
  [BLOCK_IMAGE_NAMES]: [],
  [BLOCK_DELETE_IMAGES]: [],
  [BLOCK_TYPE]: NONE,
};

export const BLOCK_SCHEMA = Yup.object().shape({
  [BLOCK_NAME]: Yup.string()
    .trim()
    .min(2, 'Block name should have at least 2 characters')
    .max(50, 'Block name should have maximum 50 characters')
    .required('Required'),
  [BLOCK_TYPE]: Yup.mixed().oneOf(VALID_TYPE_OPTIONS, 'This option is invalid.'),
  [BLOCK_IMAGE_NAMES]: Yup.string().when(BLOCK_TYPE, { is: IMAGE_TYPE, then: Yup.string().required('Required') }),
  ...CONTENT_OPTIONS.reduce(
    (prev, current) => ({
      ...prev,
      [`${current}-${BLOCK_CONTENT}`]: Yup.string().when(BLOCK_TYPE, {
        is: current,
        then: Yup.string()
          .trim()
          .required('Required'),
      }),
    }),
    {}
  ),
});
