import {
  BLOCK_NAME,
  BLOCK_TYPE,
  PAGE_TEMPLATES_NAME,
  PAGE_TEMPLATES_ALLOW_EDIT,
  PAGE_TEMPLATES_IS_AVAILABLE,
} from './pageTemplates.constants';

export const pageTemplate = {
  id: 1,
  [PAGE_TEMPLATES_NAME]: 'Page template',
  createdBy: 'owner',
  blocks: [
    {
      [BLOCK_NAME]: 'block name',
      [BLOCK_TYPE]: 1,
      key: 1,
      id: 1,
    },
  ],
  created: '2020-03-09T10:41:17+0000',
  [PAGE_TEMPLATES_ALLOW_EDIT]: true,
  [PAGE_TEMPLATES_IS_AVAILABLE]: true,
};
export const pageTemplates = [
  pageTemplate,
  {
    id: 2,
    name: 'Page template 2',
    createdBy: 'owner 2',
    blocks: [],
    created: '2020-03-09T10:41:17+0000',
  },
];
