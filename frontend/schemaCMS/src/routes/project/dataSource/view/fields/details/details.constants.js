import messages from './details.messages';

export const EMPTY = '–';

export const TYPES = {
  SHORT: 'short',
  LONG: 'long',
};

const { SHORT, LONG } = TYPES;

export const STRUCTURE = [
  {
    id: 'top',
    label: messages.sample,
    type: LONG,
  },
  {
    id: 'name',
    label: messages.sample,
    type: LONG,
    isEditable: true,
  },
  {
    id: 'dtype',
    label: messages.type,
    type: LONG,
    isEditable: true,
  },
  {
    id: 'count',
    label: messages.totalCount,
    type: SHORT,
  },
  {
    id: 'blank',
    label: messages.blank,
    type: SHORT,
  },
  {
    id: 'unique',
    label: messages.unique,
    type: SHORT,
  },
  {
    id: 'sum',
    label: messages.totalSum,
    type: SHORT,
  },
  {
    id: 'mean',
    label: messages.mean,
    type: SHORT,
    format: value => value.toFixed(2),
  },
  {
    id: 'min',
    label: messages.min,
    type: SHORT,
  },
  {
    id: 'max',
    label: messages.max,
    type: SHORT,
  },
  {
    id: 'std',
    label: messages.standardDeviation,
    type: SHORT,
    format: value => value.toFixed(2),
  },
  {
    id: 'percentile10',
    label: messages.percentile10,
    type: SHORT,
  },
  {
    id: 'percentile25',
    label: messages.percentile25,
    type: SHORT,
  },
  {
    id: 'percentile75',
    label: messages.percentile75,
    type: SHORT,
  },
  {
    id: 'percentile90',
    label: messages.percentile90,
    type: SHORT,
  },
];
