import { isEmpty } from 'ramda';

import { ROLES } from '../../modules/userProfile/userProfile.constants';

export const generateApiUrl = (slug = '') => (isEmpty(slug) ? '' : `schemacms/api/${slug}`);

export const isAdmin = user => user.role === ROLES.ADMIN;
