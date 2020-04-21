import * as Yup from 'yup';
import { complement, isEmpty } from 'ramda';
import {
  CODE_TYPE,
  CONNECTION_TYPE,
  ELEMENT_TYPE,
  ELEMENT_VALUE,
  IMAGE_TYPE,
  PLAIN_TEXT_TYPE,
  MARKDOWN_TYPE,
} from '../blockTemplates/blockTemplates.constants';

export const PAGE_NAME = 'name';
export const PAGE_DISPLAY_NAME = 'displayName';
export const PAGE_KEYWORDS = 'keywords';
export const PAGE_DESCRIPTION = 'description';
export const PAGE_TEMPLATE = 'template';
export const PAGE_IS_PUBLIC = 'isPublic';
export const PAGE_BLOCKS = 'blocks';
export const PAGE_DELETE_BLOCKS = 'deleteBlocks';

export const BLOCK_NAME = 'name';
export const BLOCK_TYPE = 'type';
export const BLOCK_ELEMENTS = 'elements';
export const BLOCK_KEY = 'key';
export const BLOCK_ID = 'id';

export const FORM_VALUES = [
  PAGE_NAME,
  PAGE_DISPLAY_NAME,
  PAGE_KEYWORDS,
  PAGE_DESCRIPTION,
  PAGE_TEMPLATE,
  PAGE_BLOCKS,
  PAGE_IS_PUBLIC,
];

export const INITIAL_VALUES = {
  [PAGE_NAME]: '',
  [PAGE_DISPLAY_NAME]: '',
  [PAGE_KEYWORDS]: '',
  [PAGE_DESCRIPTION]: '',
  [PAGE_TEMPLATE]: '',
  [PAGE_BLOCKS]: [],
  [PAGE_DELETE_BLOCKS]: [],
  [PAGE_IS_PUBLIC]: false,
};

export const INITIAL_VALUES_ADD_BLOCK = {
  [BLOCK_NAME]: '',
  [BLOCK_TYPE]: '',
};

export const PAGE_SCHEMA = Yup.object().shape({
  [PAGE_NAME]: Yup.string()
    .trim()
    .min(1, 'Page Name should have at least 1 characters')
    .max(25, 'Page Name should have maximum 25 characters')
    .required('Required'),
  [PAGE_DISPLAY_NAME]: Yup.string()
    .trim()
    .matches(/^\S+$/, "Page URL Display Name shouldn't have white spaces")
    .matches(
      /^[a-zA-Z0-9-_/]+$/,
      'Page URL Display Name should have only letters, numbers, slashes, underscores or dashes'
    )
    .max(25, 'Page URL Display Name should have maximum 25 characters'),
  [PAGE_DESCRIPTION]: Yup.string()
    .trim()
    .max(1000, 'Page Description should have maximum 1000 characters'),
  [PAGE_KEYWORDS]: Yup.string()
    .trim()
    .max(1000, 'Page Keywords should have maximum 1000 characters'),
  [PAGE_TEMPLATE]: Yup.string()
    .min(1, 'Required')
    .required('Required'),
  [PAGE_BLOCKS]: Yup.array()
    .test(PAGE_BLOCKS, 'Required', complement(isEmpty))
    .of(
      Yup.object().shape({
        [BLOCK_NAME]: Yup.string()
          .trim()
          .min(1, 'Block Name should have at least 1 character')
          .max(25, 'Block Name should have maximum 25 characters')
          .required('Required'),
        [BLOCK_ELEMENTS]: Yup.array().of(
          Yup.object().shape({
            [ELEMENT_VALUE]: Yup.mixed()
              .when(ELEMENT_TYPE, {
                is: type => [PLAIN_TEXT_TYPE, MARKDOWN_TYPE, CODE_TYPE].includes(type),
                then: Yup.string()
                  .trim()
                  .min(1, 'Required')
                  .max(1000, 'Element Value should have maximum 1000 characters')
                  .required('Required'),
              })
              .when(ELEMENT_TYPE, {
                is: CONNECTION_TYPE,
                then: Yup.string()
                  .trim()
                  .min(1, 'Required')
                  .url('Invalid URL')
                  .max(1000, 'Element Value should have maximum 1000 characters')
                  .required('Required'),
              })
              .when(ELEMENT_TYPE, {
                is: IMAGE_TYPE,
                then: Yup.object().shape({
                  fileName: Yup.string()
                    .min(1, 'Required')
                    .required('Required'),
                }),
              }),
          })
        ),
      })
    ),
});

export const ADD_BLOCK_SCHEMA = Yup.object().shape({
  [BLOCK_NAME]: Yup.string()
    .trim()
    .min(1, 'Block Name should have at least 1 characters')
    .max(25, 'Block Name should have maximum 25 characters')
    .required('Required'),
  [BLOCK_TYPE]: Yup.string()
    .trim()
    .min(1, 'Required')
    .required('Required'),
});
