import {
  PAGE_DESCRIPTION,
  PAGE_DISPLAY_NAME,
  PAGE_IS_PUBLIC,
  PAGE_KEYWORDS,
  PAGE_NAME,
  PAGE_TEMPLATE,
  PAGE_BLOCKS,
  BLOCK_TYPE,
  BLOCK_NAME,
  BLOCK_KEY,
  BLOCK_ID,
  BLOCK_ELEMENTS,
} from './page.constants';
import {
  ELEMENT_NAME,
  ELEMENT_TYPE,
  PLAIN_TEXT_TYPE,
  ELEMENT_ID,
  ELEMENT_VALUE,
} from '../blockTemplates/blockTemplates.constants';

export const element = {
  [ELEMENT_NAME]: 'name',
  [ELEMENT_TYPE]: PLAIN_TEXT_TYPE,
  [ELEMENT_VALUE]: '',
  [ELEMENT_ID]: 1,
};

export const block = {
  [BLOCK_NAME]: 'name',
  [BLOCK_TYPE]: 'type',
  [BLOCK_KEY]: 1,
  [BLOCK_ID]: 1,
  [BLOCK_ELEMENTS]: [element],
};

export const page = {
  [PAGE_NAME]: 'page name',
  [PAGE_DISPLAY_NAME]: 'page-name',
  [PAGE_KEYWORDS]: 'keyword;',
  [PAGE_DESCRIPTION]: 'description',
  [PAGE_TEMPLATE]: 'template',
  [PAGE_IS_PUBLIC]: false,
  [PAGE_BLOCKS]: [block],
  section: 'sectionId',
};
