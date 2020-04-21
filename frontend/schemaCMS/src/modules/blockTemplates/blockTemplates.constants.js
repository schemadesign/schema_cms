import * as Yup from 'yup';
import { complement, isEmpty } from 'ramda';

export const BLOCK_TEMPLATES_NAME = 'name';
export const BLOCK_TEMPLATES_ELEMENTS = 'elements';
export const BLOCK_TEMPLATES_DELETE_ELEMENTS = 'deleteElements';
export const BLOCK_TEMPLATES_IS_AVAILABLE = 'isAvailable';

export const ELEMENT_NAME = 'name';
export const ELEMENT_TYPE = 'type';
export const ELEMENT_ID = 'id';
export const ELEMENT_PARAMS = 'params';
export const ELEMENT_AUTO_OPEN = 'autoOpen';
export const ELEMENT_KEY = 'key';
export const ELEMENT_VALUE = 'value';

export const PARAMS_BLOCK = 'block';

export const MARKDOWN_TYPE = 'markdown';
export const PLAIN_TEXT_TYPE = 'plain_text';
export const IMAGE_TYPE = 'image';
export const CODE_TYPE = 'code';
export const CONNECTION_TYPE = 'connection';
export const INTERNAL_CONNECTION_TYPE = 'internal_connection';

export const ELEMENTS_TYPES = [
  MARKDOWN_TYPE,
  PLAIN_TEXT_TYPE,
  IMAGE_TYPE,
  CODE_TYPE,
  CONNECTION_TYPE,
  INTERNAL_CONNECTION_TYPE,
];

export const BLOCK_TEMPLATE_DEFAULT_ELEMENT = {
  [ELEMENT_TYPE]: '',
  [ELEMENT_NAME]: '',
  [ELEMENT_PARAMS]: {},
  [ELEMENT_AUTO_OPEN]: true,
};

export const getDefaultBlockElement = () => ({ ...BLOCK_TEMPLATE_DEFAULT_ELEMENT, [ELEMENT_KEY]: +Date.now() });

export const INITIAL_VALUES = {
  [BLOCK_TEMPLATES_NAME]: '',
  [BLOCK_TEMPLATES_ELEMENTS]: [],
  [BLOCK_TEMPLATES_DELETE_ELEMENTS]: [],
  [BLOCK_TEMPLATES_IS_AVAILABLE]: false,
};

export const BLOCK_TEMPLATES_SCHEMA = Yup.object().shape({
  [BLOCK_TEMPLATES_NAME]: Yup.string()
    .trim()
    .min(1, 'Block Template Name should have at least 1 character')
    .max(25, 'Block Template Name should have maximum 25 characters')
    .required('Required'),
  [BLOCK_TEMPLATES_ELEMENTS]: Yup.array()
    .test(BLOCK_TEMPLATES_ELEMENTS, 'Required', complement(isEmpty))
    .of(
      Yup.object().shape({
        [ELEMENT_NAME]: Yup.string()
          .trim()
          .min(1, 'Element Name should have at least 1 character')
          .max(25, 'Element Name should have maximum 25 characters')
          .required('Required'),
        [ELEMENT_TYPE]: Yup.string()
          .min(1, 'Required')
          .required('Required'),
      })
    ),
});
