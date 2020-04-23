import {
  BLOCK_TEMPLATES_ELEMENTS,
  BLOCK_TEMPLATES_IS_AVAILABLE,
  BLOCK_TEMPLATES_NAME,
  PLAIN_TEXT_TYPE,
  MARKDOWN_TYPE,
  CUSTOM_ELEMENT_TYPE,
} from './blockTemplates.constants';

const plainTextElement = {
  name: 'element name',
  id: 1,
  key: 1,
  type: PLAIN_TEXT_TYPE,
};

const customElement = {
  name: 'element name',
  id: 2,
  key: 2,
  type: CUSTOM_ELEMENT_TYPE,
  params: {
    elements: [
      {
        type: PLAIN_TEXT_TYPE,
        id: 3,
      },
    ],
  },
};

export const blockTemplate = {
  id: 1,
  [BLOCK_TEMPLATES_NAME]: 'block name',
  createdBy: 'owner',
  created: '2020-02-21T08:34:24+0000',
  [BLOCK_TEMPLATES_ELEMENTS]: [plainTextElement, customElement],
  [BLOCK_TEMPLATES_IS_AVAILABLE]: true,
};

export const emptyBlockTemplate = {
  id: 2,
  [BLOCK_TEMPLATES_NAME]: 'block name 2',
  createdBy: 'owner 2',
  created: '2020-02-21T08:34:24+0000',
  [BLOCK_TEMPLATES_ELEMENTS]: [],
  [BLOCK_TEMPLATES_IS_AVAILABLE]: false,
};

export const defaultBlockTemplate = {
  id: 3,
  [BLOCK_TEMPLATES_NAME]: 'block name 3',
  createdBy: 'owner 3',
  created: '2020-02-21T08:34:24+0000',
  [BLOCK_TEMPLATES_ELEMENTS]: [
    {
      name: 'element name',
      id: 1,
      key: 1,
      type: MARKDOWN_TYPE,
    },
  ],
  [BLOCK_TEMPLATES_IS_AVAILABLE]: false,
};

export const blockTemplates = [blockTemplate, emptyBlockTemplate, defaultBlockTemplate];
