import * as Yup from 'yup';
import { complement, isEmpty } from 'ramda';
import { BLOCK_TEMPLATES_ELEMENTS } from '../blockTemplates/blockTemplates.constants';

export const PAGE_TEMPLATES_NAME = 'name';
export const PAGE_TEMPLATES_BLOCKS = 'blocks';
export const PAGE_TEMPLATES_DELETE_BLOCKS = 'deleteBlocks';
export const PAGE_TEMPLATES_IS_AVAILABLE = 'isAvailable';
export const PAGE_TEMPLATES_ALLOW_EDIT = 'allowEdit';

export const BLOCK_NAME = 'name';
export const BLOCK_TYPE = 'block';
export const BLOCK_AUTO_OPEN = 'autoOpen';
export const BLOCK_KEY = 'key';
export const BLOCK_ID = 'id';

export const PAGE_TEMPLATE_DEFAULT_BLOCK = {
  [BLOCK_TYPE]: '',
  [BLOCK_NAME]: '',
  [BLOCK_AUTO_OPEN]: true,
};

export const getDefaultPageBlock = () => ({
  ...PAGE_TEMPLATE_DEFAULT_BLOCK,
  [BLOCK_KEY]: +Date.now(),
});

export const INITIAL_VALUES = {
  [PAGE_TEMPLATES_NAME]: '',
  [PAGE_TEMPLATES_BLOCKS]: [],
  [PAGE_TEMPLATES_DELETE_BLOCKS]: [],
  [PAGE_TEMPLATES_IS_AVAILABLE]: false,
  [PAGE_TEMPLATES_ALLOW_EDIT]: false,
};

export const PAGE_TEMPLATES_SCHEMA = Yup.object().shape({
  [PAGE_TEMPLATES_NAME]: Yup.string()
    .trim()
    .min(1, 'Page Template Name should have at least 1 character')
    .max(100, 'Page Template Name should have maximum 100 characters')
    .required('Required'),
  [PAGE_TEMPLATES_BLOCKS]: Yup.array()
    .test(BLOCK_TEMPLATES_ELEMENTS, 'Required', complement(isEmpty))
    .of(
      Yup.object().shape({
        [BLOCK_NAME]: Yup.string()
          .trim()
          .min(1, 'Block Name should have at least 1 character')
          .max(100, 'Block Name should have maximum 100 characters')
          .required('Required'),
        [BLOCK_TYPE]: Yup.string()
          .min(1, 'Required')
          .required('Required'),
      })
    ),
});
