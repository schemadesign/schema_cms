/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  PAGE_NAME,
  PAGE_KEYWORDS,
  PAGE_DESCRIPTION,
  PAGE_DISPLAY_NAME,
  PAGE_TEMPLATE,
  PAGE_IS_PUBLIC,
} from '../../../modules/page/page.constants';

export default defineMessages({
  [`${PAGE_NAME}Placeholder`]: {
    id: `shared.components.pageForm.${PAGE_NAME}Placeholder`,
    defaultMessage: 'Name',
  },
  [PAGE_NAME]: {
    id: `shared.components.pageForm.${PAGE_NAME}`,
    defaultMessage: 'Name',
  },
  [PAGE_KEYWORDS]: {
    id: `shared.components.pageForm.${PAGE_KEYWORDS}`,
    defaultMessage: 'SEO Keywords',
  },
  [PAGE_DESCRIPTION]: {
    id: `shared.components.pageForm.${PAGE_DESCRIPTION}`,
    defaultMessage: 'SEO Page Description',
  },
  [PAGE_DISPLAY_NAME]: {
    id: `shared.components.pageForm.${PAGE_DISPLAY_NAME}`,
    defaultMessage: 'URL Display Name',
  },
  [PAGE_TEMPLATE]: {
    id: `shared.components.pageForm.${PAGE_TEMPLATE}`,
    defaultMessage: 'Page Template',
  },
  [`${PAGE_TEMPLATE}Placeholder`]: {
    id: `shared.components.pageForm.${PAGE_TEMPLATE}Placeholder`,
    defaultMessage: 'Select Page Template',
  },
  [PAGE_IS_PUBLIC]: {
    id: `shared.components.pageForm.${PAGE_IS_PUBLIC}`,
    defaultMessage: 'Make it Public',
  },
  pageAvailability: {
    id: 'shared.components.pageForm.pageAvailability',
    defaultMessage: 'This Page is currently {availability}',
  },
  privateCopy: {
    id: 'shared.components.pageForm.privateCopy',
    defaultMessage: 'Private',
  },
  publicCopy: {
    id: 'shared.components.pageForm.publicCopy',
    defaultMessage: 'Public',
  },
  visitPage: {
    id: 'section.pageList.visitPage',
    defaultMessage: 'Visit Page: {page}',
  },
});
