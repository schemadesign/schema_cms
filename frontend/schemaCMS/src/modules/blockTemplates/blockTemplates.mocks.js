import { STACK_TYPE } from './blockTemplates.constants';

export const blockTemplate = {
  id: 1,
  name: 'block name',
  createdBy: 'owner',
  created: '2020-02-21T08:34:24+0000',
  elements: [
    {
      name: 'element name',
      id: 1,
      type: STACK_TYPE,
      params: {
        block: 'block name',
      },
    },
  ],
};
export const blockTemplates = [
  blockTemplate,
  { id: 2, name: 'block name 2', createdBy: 'owner 2', created: '2020-02-21T08:34:24+0000', elements: [] },
];
