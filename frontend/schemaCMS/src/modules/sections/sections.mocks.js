import { SECTIONS_MAIN_PAGE, SECTIONS_NAME, SECTIONS_PUBLISH } from './sections.constants';
import { PAGE_DISPLAY_NAME } from '../page/page.constants';

export const section = {
  id: 1,
  [SECTIONS_NAME]: 'Section name',
  slug: 'section-name',
  createdBy: 'owner',
  pages: [
    {
      createdBy: 'owner',
      created: '2020-03-09T10:41:17+0000',
      name: 'page name',
      id: 1,
      templateName: 'templateName',
      [PAGE_DISPLAY_NAME]: 'page-name',
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
  [SECTIONS_PUBLISH]: true,
  [SECTIONS_MAIN_PAGE]: 1,
  created: '2020-03-09T10:41:17+0000',
};

export const sections = [
  section,
  {
    id: 2,
    [SECTIONS_NAME]: 'Section name 2',
    slug: 'section-name-2',
    createdBy: 'owner 2',
    pages: [],
    pagesCount: 0,
    [SECTIONS_PUBLISH]: false,
    [SECTIONS_MAIN_PAGE]: null,
    created: '2020-03-09T10:41:17+0000',
  },
];
