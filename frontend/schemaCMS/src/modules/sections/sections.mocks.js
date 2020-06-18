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
    {
      createdBy: 'owner',
      created: '2020-03-09T10:41:17+0000',
      name: 'page name 3',
      id: 3,
      templateName: null,
    },
  ],
  pagesCount: 1,
  [SECTIONS_PUBLISH]: true,
  [SECTIONS_MAIN_PAGE]: 3,
  created: '2020-03-09T10:41:17+0000',
};

export const pages = {
  count: 11,
  results: [
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
    {
      createdBy: 'owner',
      created: '2020-03-09T10:41:17+0000',
      name: 'page name 3',
      id: 3,
      templateName: null,
    },
  ],
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

export const internalConnections = [
  {
    id: 5,
    project: 2,
    name: 'Section 1',
    mainPage: null,
    pages: [{ id: 1, displayName: 'blog', name: 'Blog' }],
  },
  {
    id: 4,
    project: 2,
    name: 'Section 2',
    mainPage: { id: 3, name: 'news', displayName: 'News' },
    pages: [
      { id: 2, displayName: 'article-2', name: 'Article 2' },
      { id: 3, displayName: 'news', name: 'News' },
      { id: 4, displayName: 'article-1', name: 'Article 1' },
    ],
  },
];

export const pagerUrlOptions = [
  { label: 'Blog', value: 'http://domain.com/blog' },
  { label: 'news   >   Article 2', value: 'http://domain.com/News/article-2' },
  { label: 'News', value: 'http://domain.com/news' },
];
