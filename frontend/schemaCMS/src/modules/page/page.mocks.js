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
  PAGE_DELETE_BLOCKS,
} from './page.constants';
import {
  ELEMENT_NAME,
  ELEMENT_TYPE,
  PLAIN_TEXT_TYPE,
  IMAGE_TYPE,
  STACK_TYPE,
  ELEMENT_ID,
  ELEMENT_VALUE,
  ELEMENT_PARAMS,
} from '../blockTemplates/blockTemplates.constants';

export const textElement = {
  [ELEMENT_NAME]: 'name',
  [ELEMENT_TYPE]: PLAIN_TEXT_TYPE,
  [ELEMENT_VALUE]: '',
  [ELEMENT_ID]: 1,
};

export const imageElement = {
  [ELEMENT_NAME]: 'name',
  [ELEMENT_TYPE]: IMAGE_TYPE,
  [ELEMENT_VALUE]: {
    fileName: 'fileName',
  },
  [ELEMENT_ID]: 1,
};

export const stackElement = {
  [ELEMENT_NAME]: 'name',
  [ELEMENT_TYPE]: STACK_TYPE,
  [ELEMENT_VALUE]: [
    {
      [BLOCK_NAME]: 'name',
      [BLOCK_TYPE]: 'type',
      [BLOCK_KEY]: 1,
      [BLOCK_ID]: 1,
      [BLOCK_ELEMENTS]: [textElement, imageElement],
    },
  ],
  [ELEMENT_ID]: 1,
  [ELEMENT_PARAMS]: {
    block: 3,
  },
};

export const block = {
  [BLOCK_NAME]: 'name',
  [BLOCK_TYPE]: 'type',
  [BLOCK_KEY]: 1,
  [BLOCK_ID]: 1,
  [BLOCK_ELEMENTS]: [textElement, imageElement, stackElement],
};

export const page = {
  [PAGE_NAME]: 'page name',
  [PAGE_DISPLAY_NAME]: 'page-name',
  [PAGE_KEYWORDS]: 'keyword;',
  [PAGE_DESCRIPTION]: 'description',
  [PAGE_TEMPLATE]: 1,
  [PAGE_IS_PUBLIC]: false,
  [PAGE_BLOCKS]: [block],
  [PAGE_DELETE_BLOCKS]: [],
  section: {
    id: 'sectionId',
    title: 'Section',
  },
};
