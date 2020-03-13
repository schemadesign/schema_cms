import { BLOCK_NAME, BLOCK_TYPE } from './pageTemplates.constants';

export const pageTemplate = {
  id: 1,
  name: 'Page template',
  createdBy: 'owner',
  blocks: [
    {
      [BLOCK_NAME]: 'block name',
      [BLOCK_TYPE]: 'block type',
      key: 1,
      id: 1,
    },
  ],
  created: '2020-03-09T10:41:17+0000',
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
