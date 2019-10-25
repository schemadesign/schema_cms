/* eslint-disable max-len */
import { defineMessages } from 'react-intl';
import {
  FIELD,
  SAMPLE,
  NAME,
  TYPE,
  COUNT,
  BLANK,
  UNIQUE,
  SUM,
  MEAN,
  MEDIAN,
  MIN,
  MAX,
  STD,
  PERCENTILE_10,
  PERCENTILE_25,
  PERCENTILE_75,
  PERCENTILE_90,
} from './fieldDetail.constants';

export default defineMessages({
  [FIELD]: {
    id: `shared.components.fieldDetail.details.${FIELD}`,
    defaultMessage: 'Field',
  },
  [SAMPLE]: {
    id: `shared.components.fieldDetail.${SAMPLE}`,
    defaultMessage: 'Sample',
  },
  [NAME]: {
    id: `shared.components.fieldDetail.${NAME}`,
    defaultMessage: 'Field Name',
  },
  [TYPE]: {
    id: `shared.components.fieldDetail.${TYPE}`,
    defaultMessage: 'Type',
  },
  [COUNT]: {
    id: `shared.components.fieldDetail.${COUNT}`,
    defaultMessage: 'Total Count (N)',
  },
  [BLANK]: {
    id: `shared.components.fieldDetail.${BLANK}`,
    defaultMessage: 'Blank + NaN',
  },
  [UNIQUE]: {
    id: `shared.components.fieldDetail.${UNIQUE}`,
    defaultMessage: 'Unique',
  },
  [SUM]: {
    id: `shared.components.fieldDetail.${SUM}`,
    defaultMessage: 'Total Sum',
  },
  [MEAN]: {
    id: `shared.components.fieldDetail.${MEAN}`,
    defaultMessage: 'Mean',
  },
  [MIN]: {
    id: `shared.components.fieldDetail.${MIN}`,
    defaultMessage: 'Min',
  },
  [MAX]: {
    id: `shared.components.fieldDetail.${MAX}`,
    defaultMessage: 'Max',
  },
  [STD]: {
    id: `shared.components.fieldDetail.${STD}`,
    defaultMessage: 'Std. Dev.',
  },
  [MEDIAN]: {
    id: `shared.components.fieldDetail.${MEDIAN}`,
    defaultMessage: 'Median',
  },
  [PERCENTILE_10]: {
    id: `shared.components.fieldDetail.${PERCENTILE_10}`,
    defaultMessage: '10th Percentile',
  },
  [PERCENTILE_25]: {
    id: `shared.components.fieldDetail.${PERCENTILE_25}`,
    defaultMessage: '25th Percentile',
  },
  [PERCENTILE_75]: {
    id: `shared.components.fieldDetail.${PERCENTILE_75}`,
    defaultMessage: '75th Percentile',
  },
  [PERCENTILE_90]: {
    id: `shared.components.fieldDetail.${PERCENTILE_90}`,
    defaultMessage: '90th Percentile',
  },
});
