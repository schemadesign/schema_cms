import { isEmpty } from 'ramda';

export const generateApiUrl = (slug = '') => (isEmpty(slug) ? '' : `schemacms/api/${slug}`);
