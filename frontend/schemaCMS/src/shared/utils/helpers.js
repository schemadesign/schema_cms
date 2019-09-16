import { equals, isEmpty, pipe, prop } from 'ramda';

import { ROLES } from '../../modules/userProfile/userProfile.constants';

export const generateApiUrl = (slug = '') => (isEmpty(slug) ? '' : `schemacms/api/${slug}`);

export const isAdmin = pipe(
  prop('role'),
  equals(ROLES.ADMIN)
);
