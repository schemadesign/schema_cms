import * as Yup from 'yup';
import { complement, isEmpty } from 'ramda';
import {
  CODE_TYPE,
  CONNECTION_TYPE,
  ELEMENT_TYPE,
  ELEMENT_VALUE,
  ELEMENT_NAME,
  PLAIN_TEXT_TYPE,
  MARKDOWN_TYPE,
  OBSERVABLEHQ_TYPE,
  OBSERVABLE_USER,
  OBSERVABLE_NOTEBOOK,
  OBSERVABLE_CELL,
  OBSERVABLE_PARAMS,
  CUSTOM_ELEMENT_TYPE,
  BLOCK_TEMPLATES_ELEMENTS,
  blockTemplatesElementsValidation,
  EMBED_VIDEO_TYPE,
  ELEMENT_PARAMS,
  IMAGE_TYPE,
} from '../blockTemplates/blockTemplates.constants';

export const PAGE_NAME = 'name';
export const PAGE_DISPLAY_NAME = 'displayName';
export const PAGE_KEYWORDS = 'keywords';
export const PAGE_DESCRIPTION = 'description';
export const PAGE_TEMPLATE = 'template';
export const PAGE_IS_PUBLIC = 'isPublic';
export const PAGE_BLOCKS = 'blocks';
export const PAGE_DELETE_BLOCKS = 'deleteBlocks';
export const PAGE_TAGS = 'tags';
export const PAGE_LINK = 'link';
export const PAGE_SOCIAL_TITLE = 'socialTitle';
export const PAGE_SOCIAL_DESC = 'socialDescription';
export const PAGE_SOCIAL_IMG_TITLE = 'socialImageTitle';
export const PAGE_SOCIAL_IMG = 'socialImage';

export const BLOCK_NAME = 'name';
export const BLOCK_TYPE = 'type';
export const BLOCK_ELEMENTS = 'elements';
export const BLOCK_KEY = 'key';
export const BLOCK_ID = 'id';

export const FILE = 'file';
export const FILE_NAME = 'fileName';
export const FILE_ALT = 'alt';

export const FORM_VALUES = [
  PAGE_NAME,
  PAGE_DISPLAY_NAME,
  PAGE_KEYWORDS,
  PAGE_DESCRIPTION,
  PAGE_TEMPLATE,
  PAGE_BLOCKS,
  PAGE_LINK,
  PAGE_IS_PUBLIC,
  PAGE_SOCIAL_TITLE,
  PAGE_SOCIAL_DESC,
  PAGE_SOCIAL_IMG_TITLE,
  PAGE_SOCIAL_IMG,
];

export const INITIAL_VALUES = {
  [PAGE_NAME]: '',
  [PAGE_DISPLAY_NAME]: '',
  [PAGE_KEYWORDS]: '',
  [PAGE_DESCRIPTION]: '',
  [PAGE_TEMPLATE]: '',
  [PAGE_BLOCKS]: [],
  [PAGE_TAGS]: {},
  [PAGE_LINK]: '',
  [PAGE_SOCIAL_TITLE]: '',
  [PAGE_SOCIAL_DESC]: '',
  [PAGE_SOCIAL_IMG_TITLE]: '',
  [PAGE_SOCIAL_IMG]: {},
  [PAGE_DELETE_BLOCKS]: [],
  [PAGE_IS_PUBLIC]: false,
};

export const INITIAL_VALUES_ADD_BLOCK = {
  [BLOCK_TYPE]: '',
  [BLOCK_TEMPLATES_ELEMENTS]: [],
};

const elementValueValidation = () =>
  Yup.mixed()
    .when(ELEMENT_TYPE, {
      is: type => [PLAIN_TEXT_TYPE, MARKDOWN_TYPE, CODE_TYPE].includes(type),
      then: Yup.string()
        .trim()
        .max(50000, 'Element Value should have maximum 50 000 characters'),
    })
    .when(ELEMENT_TYPE, {
      is: type => [CONNECTION_TYPE, EMBED_VIDEO_TYPE].includes(type),
      then: Yup.string()
        .trim()
        .url('Invalid URL')
        .max(1000, 'Element Value should have maximum 1000 characters'),
    })
    .when(ELEMENT_TYPE, {
      is: OBSERVABLEHQ_TYPE,
      then: Yup.object().shape({
        [OBSERVABLE_USER]: Yup.string().max(1000, 'ObservableHQ User Value should have maximum 1000 characters'),
        [OBSERVABLE_NOTEBOOK]: Yup.string().max(1000, 'ObservableHQ Notebook should have maximum 1000 characters'),
        [OBSERVABLE_CELL]: Yup.string().max(1000, 'ObservableHQ Cell should have maximum 1000 characters'),
        [OBSERVABLE_PARAMS]: Yup.string().max(1000, 'ObservableHQ Params should have maximum 1000 characters'),
      }),
    });

export const PAGE_SCHEMA = Yup.object().shape({
  [PAGE_NAME]: Yup.string()
    .trim()
    .min(1, 'Page Name should have at least 1 characters')
    .max(100, 'Page Name should have maximum 100 characters')
    .required('Required'),
  [PAGE_DISPLAY_NAME]: Yup.string()
    .trim()
    .matches(/^\S+$/, "Page URL Display Name shouldn't have white spaces")
    .matches(
      /^[a-zA-Z0-9-_/]+$/,
      'Page URL Display Name should have only letters, numbers, slashes, underscores or dashes'
    )
    .max(100, 'Page URL Display Name should have maximum 100 characters'),
  [PAGE_DESCRIPTION]: Yup.string()
    .trim()
    .max(1000, 'Page Description should have maximum 1000 characters'),
  [PAGE_KEYWORDS]: Yup.string()
    .trim()
    .max(1000, 'Page Keywords should have maximum 1000 characters'),
  [PAGE_LINK]: Yup.string()
    .trim()
    .url('The link field needs to be a valid URL'),
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
          .max(100, 'Block Name should have maximum 100 characters')
          .required('Required'),
        [BLOCK_ELEMENTS]: Yup.array().of(
          Yup.object().shape({
            [ELEMENT_NAME]: Yup.string()
              .trim()
              .max(100, 'Element Name should have maximum 100 characters'),
            [ELEMENT_PARAMS]: Yup.object().when(ELEMENT_TYPE, {
              is: IMAGE_TYPE,
              then: Yup.object().shape({
                [FILE_ALT]: Yup.string()
                  .trim()
                  .max(1000, 'Alt should have maximum 1000 characters'),
              }),
            }),
            [ELEMENT_VALUE]: elementValueValidation().when(ELEMENT_TYPE, {
              is: CUSTOM_ELEMENT_TYPE,
              then: Yup.array().of(
                Yup.object().shape({
                  elements: Yup.array().of(
                    Yup.object().shape({
                      [ELEMENT_VALUE]: elementValueValidation(),
                    })
                  ),
                })
              ),
            }),
          })
        ),
      })
    ),
  [PAGE_SOCIAL_TITLE]: Yup.string()
    .trim()
    .max(250, 'Social Media Title should have maximum 250 characters'),
  [PAGE_SOCIAL_DESC]: Yup.string()
    .trim()
    .max(1000, 'Social Media Description should have maximum 1000 characters'),
  [PAGE_SOCIAL_IMG_TITLE]: Yup.string()
    .trim()
    .max(250, 'Social Media Image title should have maximum 250 characters'),
});

export const ADD_BLOCK_SCHEMA = Yup.object().shape({
  [BLOCK_TYPE]: Yup.string()
    .trim()
    .min(1, 'Required')
    .required('Required'),
  [BLOCK_TEMPLATES_ELEMENTS]: Yup.array().when(BLOCK_TYPE, {
    then: blockTemplatesElementsValidation(),
    is: '0',
  }),
});
