import { defineMessages } from 'react-intl';

import { BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, OTHER } from './errorContainer.constants';

export default defineMessages({
  [BAD_REQUEST]: {
    id: `shared.components.errorContainer.${BAD_REQUEST}`,
    defaultMessage: 'Bad Request',
  },
  [UNAUTHORIZED]: {
    id: `shared.components.errorContainer.${UNAUTHORIZED}`,
    defaultMessage: 'Unauthorized',
  },
  [FORBIDDEN]: {
    id: `shared.components.errorContainer.${FORBIDDEN}`,
    defaultMessage: 'Forbidden',
  },
  [NOT_FOUND]: {
    id: `shared.components.errorContainer.${NOT_FOUND}`,
    defaultMessage: 'Not Found',
  },
  [OTHER]: {
    id: `shared.components.errorContainer.${OTHER}`,
    defaultMessage: 'An Error occured',
  },
});
