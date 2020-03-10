import * as Yup from 'yup';
import { complement, isEmpty } from 'ramda';

export const BLOCK_TEMPLATES_NAME = 'name';
export const BLOCK_TEMPLATES_ELEMENTS = 'elements';
export const BLOCK_TEMPLATES_DELETE_ELEMENTS = 'deleteElements';
export const BLOCK_TEMPLATES_IS_AVAILABLE = 'isAvailable';
export const BLOCK_TEMPLATES_ALLOW_ADD = 'allowAdd';

export const ELEMENT_NAME = 'name';
export const ELEMENT_TYPE = 'type';
export const ELEMENT_ID = 'id';
export const ELEMENT_PARAMS = 'params';

export const PARAMS_BLOCK = 'block';

export const RICH_TEXT_TYPE = 'rich_text';
export const PLAIN_TEXT_TYPE = 'plain_text';
export const IMAGE_TYPE = 'image';
export const CODE_TYPE = 'code';
export const CONNECTION_TYPE = 'connection';
export const STACK_TYPE = 'stack';

export const ELEMENTS_TYPES = [RICH_TEXT_TYPE, PLAIN_TEXT_TYPE, IMAGE_TYPE, CODE_TYPE, CONNECTION_TYPE, STACK_TYPE];

export const BLOCK_TEMPLATE_DEFAULT_ELEMENT = {
  [ELEMENT_TYPE]: '',
  [ELEMENT_NAME]: '',
  [ELEMENT_PARAMS]: {},
};

export const INITIAL_VALUES = {
  [BLOCK_TEMPLATES_NAME]: '',
  [BLOCK_TEMPLATES_ELEMENTS]: [BLOCK_TEMPLATE_DEFAULT_ELEMENT],
  [BLOCK_TEMPLATES_DELETE_ELEMENTS]: [],
  [BLOCK_TEMPLATES_IS_AVAILABLE]: false,
  [BLOCK_TEMPLATES_ALLOW_ADD]: false,
};

export const BLOCK_TEMPLATES_SCHEMA = Yup.object().shape({
  [BLOCK_TEMPLATES_NAME]: Yup.string()
    .trim()
    .min(3, 'Block Template Name should have at least 3 characters')
    .max(25, 'Block Template Name should have maximum 25 characters')
    .required('Required'),
  [BLOCK_TEMPLATES_ELEMENTS]: Yup.array()
    .test(BLOCK_TEMPLATES_ELEMENTS, 'Required', complement(isEmpty))
    .of(
      Yup.object().shape({
        [ELEMENT_NAME]: Yup.string()
          .trim()
          .min(3, 'Element Name should have at least 3 characters')
          .max(25, 'Element Name should have maximum 25 characters')
          .required('Required'),
        [ELEMENT_TYPE]: Yup.string()
          .min(1, 'Required')
          .required('Required'),
        [ELEMENT_PARAMS]: Yup.object().when(ELEMENT_TYPE, {
          is: STACK_TYPE,
          then: Yup.object().shape({
            [PARAMS_BLOCK]: Yup.string()
              .min(1, 'Required')
              .required('Required'),
          }),
        }),
      })
    ),
});
