import {
  PAGE_DESCRIPTION,
  PAGE_DISPLAY_NAME,
  PAGE_IS_PUBLIC,
  PAGE_KEYWORDS,
  PAGE_NAME,
  PAGE_TEMPLATE,
  PAGE_TEMPLATE_BLOCKS,
} from './page.constants';

export const page = {
  [PAGE_NAME]: 'page name',
  [PAGE_DISPLAY_NAME]: 'page-name',
  [PAGE_KEYWORDS]: 'keyword;',
  [PAGE_DESCRIPTION]: 'description',
  [PAGE_TEMPLATE]: 'template',
  [PAGE_IS_PUBLIC]: false,
  [PAGE_TEMPLATE_BLOCKS]: [{ name: 'name' }],
  section: 'sectionId',
};
