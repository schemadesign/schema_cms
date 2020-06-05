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
  PAGE_TAGS,
} from './page.constants';
import {
  ELEMENT_NAME,
  ELEMENT_TYPE,
  PLAIN_TEXT_TYPE,
  IMAGE_TYPE,
  ELEMENT_ID,
  ELEMENT_VALUE,
  INTERNAL_CONNECTION_TYPE,
  MARKDOWN_TYPE,
  OBSERVABLEHQ_TYPE,
  OBSERVABLE_CELL,
  OBSERVABLE_NOTEBOOK,
  OBSERVABLE_USER,
  CUSTOM_ELEMENT_TYPE,
  FILE_TYPE,
  EMBED_VIDEO_TYPE,
  ELEMENT_PARAMS,
  EMBED_VIDEO_HEIGHT,
  EMBED_VIDEO_WIDTH,
} from '../blockTemplates/blockTemplates.constants';
import { SECTIONS_MAIN_PAGE } from '../sections/sections.constants';

export const textElement = {
  [ELEMENT_NAME]: 'name',
  [ELEMENT_TYPE]: PLAIN_TEXT_TYPE,
  [ELEMENT_VALUE]: 'plain text value',
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

export const fileElement = {
  [ELEMENT_NAME]: 'name',
  [ELEMENT_TYPE]: FILE_TYPE,
  [ELEMENT_VALUE]: {
    fileName: 'fileName',
  },
  [ELEMENT_ID]: 1,
};

export const embedVideoElement = {
  [ELEMENT_NAME]: 'name',
  [ELEMENT_PARAMS]: {
    [EMBED_VIDEO_HEIGHT]: 1000,
    [EMBED_VIDEO_WIDTH]: 1000,
  },
  [ELEMENT_TYPE]: EMBED_VIDEO_TYPE,
  [ELEMENT_VALUE]: 'http://youtube',
  [ELEMENT_ID]: 1,
};

export const internalConnectionElement = {
  [ELEMENT_NAME]: 'name',
  [ELEMENT_TYPE]: INTERNAL_CONNECTION_TYPE,
  [ELEMENT_VALUE]: 'http://domain.com/blog',
  [ELEMENT_ID]: 1,
};

export const markdownElement = {
  [ELEMENT_NAME]: 'name',
  [ELEMENT_TYPE]: MARKDOWN_TYPE,
  [ELEMENT_VALUE]: '**Hello world!!!**',
  [ELEMENT_ID]: 1,
};

export const observableHQElement = {
  [ELEMENT_NAME]: 'name',
  [ELEMENT_TYPE]: OBSERVABLEHQ_TYPE,
  [ELEMENT_VALUE]: {
    [OBSERVABLE_USER]: '@user',
    [OBSERVABLE_NOTEBOOK]: 'my-notebook',
    [OBSERVABLE_CELL]: 'notebook-cell',
  },
  [ELEMENT_ID]: 1,
};

export const customElement = {
  [ELEMENT_NAME]: 'custom element',
  [ELEMENT_TYPE]: CUSTOM_ELEMENT_TYPE,
  [ELEMENT_VALUE]: [
    { elements: [textElement, textElement, markdownElement], id: 1 },
    { elements: [textElement, textElement, markdownElement], id: 2 },
    { elements: [textElement, textElement, markdownElement], id: 3 },
  ],
  [ELEMENT_ID]: 1,
};

export const block = {
  [BLOCK_NAME]: 'name',
  [BLOCK_TYPE]: 'type',
  [BLOCK_KEY]: 1,
  [BLOCK_ID]: 1,
  [BLOCK_ELEMENTS]: [textElement, internalConnectionElement, markdownElement, observableHQElement, customElement],
};

export const page = {
  id: 1,
  [PAGE_NAME]: 'page name',
  [PAGE_DISPLAY_NAME]: 'page-name',
  [PAGE_KEYWORDS]: 'keyword;',
  [PAGE_DESCRIPTION]: 'description',
  [PAGE_TEMPLATE]: 1,
  [PAGE_IS_PUBLIC]: false,
  [PAGE_BLOCKS]: [block],
  [PAGE_DELETE_BLOCKS]: [],
  [PAGE_TAGS]: [],
  section: {
    id: 'sectionId',
    title: 'Section',
    [SECTIONS_MAIN_PAGE]: {
      id: 2,
      [PAGE_DISPLAY_NAME]: 'page-name-2',
    },
  },
};
