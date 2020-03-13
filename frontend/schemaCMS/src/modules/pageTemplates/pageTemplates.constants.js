import * as Yup from 'yup';
import { complement, isEmpty } from 'ramda';
import { BLOCK_TEMPLATES_ELEMENTS } from '../blockTemplates/blockTemplates.constants';

export const PAGE_TEMPLATES_NAME = 'name';
export const PAGE_TEMPLATES_BLOCKS = 'blocks';
export const PAGE_TEMPLATES_DELETE_ELEMENTS = 'deleteElements';
export const PAGE_TEMPLATES_IS_AVAILABLE = 'isAvailable';
export const PAGE_TEMPLATES_ALLOW_ADD = 'allowAdd';

export const BLOCK_NAME = 'name';
export const BLOCK_TYPE = 'type';
export const BLOCK_AUTO_OPEN = 'autoOpen';
export const BLOCK_KEY = 'key';

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
  [PAGE_TEMPLATES_DELETE_ELEMENTS]: [],
  [PAGE_TEMPLATES_IS_AVAILABLE]: false,
  [PAGE_TEMPLATES_ALLOW_ADD]: false,
};

export const PAGE_TEMPLATES_SCHEMA = Yup.object().shape({
  [PAGE_TEMPLATES_NAME]: Yup.string()
    .trim()
    .min(3, 'Page Template Name should have at least 3 characters')
    .max(25, 'Page Template Name should have maximum 25 characters')
    .required('Required'),
  [PAGE_TEMPLATES_BLOCKS]: Yup.array()
    .test(BLOCK_TEMPLATES_ELEMENTS, 'Required', complement(isEmpty))
    .of(
      Yup.object().shape({
        [BLOCK_NAME]: Yup.string()
          .trim()
          .min(3, 'Block Name should have at least 3 characters')
          .max(25, 'Block Name should have maximum 25 characters')
          .required('Required'),
        [BLOCK_TYPE]: Yup.string()
          .min(1, 'Required')
          .required('Required'),
      })
    ),
});
