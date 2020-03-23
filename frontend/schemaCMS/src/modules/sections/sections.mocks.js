export const section = {
  id: 1,
  name: 'Section name',
  slug: 'section-name',
  createdBy: 'owner',
  pages: [
    {
      createdBy: 'owner',
      created: '2020-03-09T10:41:17+0000',
      name: 'page name',
      id: 1,
      templateName: 'templateName',
    },
    {
      createdBy: 'owner',
      created: '2020-03-09T10:41:17+0000',
      name: 'page name 2',
      id: 2,
      templateName: null,
    },
  ],
  pagesCount: 1,
  isPublish: true,
  created: '2020-03-09T10:41:17+0000',
};

export const sections = [
  section,
  {
    id: 2,
    name: 'Section name 2',
    slug: 'section-name-2',
    createdBy: 'owner 2',
    pages: [],
    pagesCount: 0,
    isPublish: false,
    created: '2020-03-09T10:41:17+0000',
  },
];
