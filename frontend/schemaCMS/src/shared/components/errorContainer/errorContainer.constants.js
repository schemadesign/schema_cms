export const ERROR_TYPES = {
  DEFAULT: 'default',
  PAGE: 'page',
};

export const BAD_REQUEST_RAW = 'bad_request';
export const NOT_FOUND_RAW = 'not_found';

export const BAD_REQUEST = 'badRequest';
export const UNAUTHORIZED = 'unauthorized';
export const FORBIDDEN = 'forbidden';
export const NOT_FOUND = 'notFound';
export const OTHER = 'other';

export const CODES = {
  [BAD_REQUEST_RAW]: BAD_REQUEST,
  [NOT_FOUND_RAW]: NOT_FOUND,
  [UNAUTHORIZED]: UNAUTHORIZED,
  [FORBIDDEN]: FORBIDDEN,
  [OTHER]: OTHER,
};
