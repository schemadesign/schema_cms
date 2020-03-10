import {
  BLOCK_TEMPLATES_ALLOW_ADD,
  BLOCK_TEMPLATES_ELEMENTS,
  BLOCK_TEMPLATES_IS_AVAILABLE,
  BLOCK_TEMPLATES_NAME,
  STACK_TYPE,
} from './blockTemplates.constants';

export const blockTemplate = {
  id: 1,
  [BLOCK_TEMPLATES_NAME]: 'block name',
  createdBy: 'owner',
  created: '2020-02-21T08:34:24+0000',
  [BLOCK_TEMPLATES_ELEMENTS]: [
    {
      name: 'element name',
      id: 1,
      type: STACK_TYPE,
      params: {
        block: 'block name 2',
      },
    },
  ],
  [BLOCK_TEMPLATES_IS_AVAILABLE]: true,
  [BLOCK_TEMPLATES_ALLOW_ADD]: false,
};
export const blockTemplates = [
  blockTemplate,
  {
    id: 2,
    [BLOCK_TEMPLATES_NAME]: 'block name 2',
    createdBy: 'owner 2',
    created: '2020-02-21T08:34:24+0000',
    [BLOCK_TEMPLATES_ELEMENTS]: [],
    [BLOCK_TEMPLATES_IS_AVAILABLE]: false,
    [BLOCK_TEMPLATES_ALLOW_ADD]: false,
  },
];
