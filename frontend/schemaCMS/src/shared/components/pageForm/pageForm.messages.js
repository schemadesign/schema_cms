/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  PAGE_NAME,
  PAGE_KEYWORDS,
  PAGE_DESCRIPTION,
  PAGE_DISPLAY_NAME,
  PAGE_TEMPLATE,
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
});
