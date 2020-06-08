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
export const CUSTOM_ELEMENT_TYPE = 'custom_element';
export const OBSERVABLEHQ_TYPE = 'observable_hq';
export const FILE_TYPE = 'file';
export const EMBED_VIDEO_TYPE = 'embed_video';
export const STATE_TYPE = 'state';

export const OBSERVABLE_USER = 'observableUser';
export const OBSERVABLE_NOTEBOOK = 'observableNotebook';
export const OBSERVABLE_CELL = 'observableCell';
export const OBSERVABLE_PARAMS = 'observableParams';

export const EMBED_VIDEO_ATTRIBUTES = 'attributes';

export const CUSTOM_ELEMENTS_TYPES = [
  MARKDOWN_TYPE,
  PLAIN_TEXT_TYPE,
  FILE_TYPE,
  IMAGE_TYPE,
  CODE_TYPE,
  CONNECTION_TYPE,
  INTERNAL_CONNECTION_TYPE,
  OBSERVABLEHQ_TYPE,
  EMBED_VIDEO_TYPE,
  STATE_TYPE,
];

export const ELEMENTS_TYPES = [...CUSTOM_ELEMENTS_TYPES, CUSTOM_ELEMENT_TYPE];

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

export const blockTemplatesElementsValidation = () =>
  Yup.array()
    .test(BLOCK_TEMPLATES_ELEMENTS, 'Required', complement(isEmpty))
    .of(
      Yup.object().shape({
        [ELEMENT_NAME]: Yup.string()
          .trim()
          .min(1, 'Element Name should have at least 1 character')
          .max(100, 'Element Name should have maximum 100 characters')
          .required('Required'),
        [ELEMENT_TYPE]: Yup.string()
          .min(1, 'Required')
          .required('Required'),
        [ELEMENT_PARAMS]: Yup.object().when(ELEMENT_TYPE, {
          is: CUSTOM_ELEMENT_TYPE,
          then: Yup.object().shape({
            [BLOCK_TEMPLATES_ELEMENTS]: Yup.array()
              .of(
                Yup.object().shape({
                  [ELEMENT_TYPE]: Yup.string()
                    .trim()
                    .required('Required'),
                })
              )
              .required('Required'),
          }),
        }),
      })
    );

export const BLOCK_TEMPLATES_SCHEMA = Yup.object().shape({
  [BLOCK_TEMPLATES_NAME]: Yup.string()
    .trim()
    .min(1, 'Block Template Name should have at least 1 character')
    .max(100, 'Block Template Name should have maximum 100 characters')
    .required('Required'),
  [BLOCK_TEMPLATES_ELEMENTS]: blockTemplatesElementsValidation(),
});
