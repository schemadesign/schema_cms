export const EMPTY = '–';

export const TYPES = {
  SHORT: 'short',
  LONG: 'long',
};

const { LONG } = TYPES;

const SAMPLE = {
  id: 'top',
  translationId: 'sample',
  type: LONG,
};

const NAME = {
  id: 'name',
  type: LONG,
  isEditable: true,
};

const TYPE = {
  id: 'dtype',
  translationId: 'type',
  type: LONG,
  isEditable: true,
};

const TOTAL_COUNT = {
  id: 'count',
  translationId: 'totalCount',
};

const BLANK = {
  id: 'blank',
};

const UNIQUE = {
  id: 'unique',
};

const TOTAL_SUM = {
  id: 'sum',
  translationId: 'totalSum',
};

const MEAN = {
  id: 'mean',
  format: value => value.toFixed(2),
};

const MIN = {
  id: 'min',
};

const MAX = {
  id: 'max',
};

const STANDARD_DEVIATION = {
  id: 'std',
  translationId: 'standardDeviation',
  format: value => value.toFixed(2),
};

const PERCENTILE_10 = {
  id: 'percentile10',
};

const PERCENTILE_25 = {
  id: 'percentile25',
};

const PERCENTILE_75 = {
  id: 'percentile75',
};

const PERCENTILE_90 = {
  id: 'percentile90',
};

export const DEFAULT_STUCTURE = [
  SAMPLE,
  NAME,
  TYPE,
  TOTAL_COUNT,
  BLANK,
  UNIQUE,
  TOTAL_SUM,
  MEAN,
  MIN,
  MAX,
  STANDARD_DEVIATION,
  PERCENTILE_10,
  PERCENTILE_25,
  PERCENTILE_75,
  PERCENTILE_90,
];
