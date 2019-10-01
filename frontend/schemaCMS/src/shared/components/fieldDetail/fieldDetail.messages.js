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
    id: `project.dataSource.fields.details.${FIELD}`,
    defaultMessage: 'Field',
  },
  [SAMPLE]: {
    id: `project.dataSource.fields.details.${SAMPLE}`,
    defaultMessage: 'Sample',
  },
  [NAME]: {
    id: `project.dataSource.fields.details.${NAME}`,
    defaultMessage: 'Field Name',
  },
  [TYPE]: {
    id: `project.dataSource.fields.details.${TYPE}`,
    defaultMessage: 'Type',
  },
  [COUNT]: {
    id: `project.dataSource.fields.details.${COUNT}`,
    defaultMessage: 'Total Count (N)',
  },
  [BLANK]: {
    id: `project.dataSource.fields.details.${BLANK}`,
    defaultMessage: 'Blank + NaN',
  },
  [UNIQUE]: {
    id: `project.dataSource.fields.details.${UNIQUE}`,
    defaultMessage: 'Unique',
  },
  [SUM]: {
    id: `project.dataSource.fields.details.${SUM}`,
    defaultMessage: 'Total Sum',
  },
  [MEAN]: {
    id: `project.dataSource.fields.details.${MEAN}`,
    defaultMessage: 'Mean',
  },
  [MIN]: {
    id: `project.dataSource.fields.details.${MIN}`,
    defaultMessage: 'Min',
  },
  [MAX]: {
    id: `project.dataSource.fields.details.${MAX}`,
    defaultMessage: 'Max',
  },
  [STD]: {
    id: `project.dataSource.fields.details.${STD}`,
    defaultMessage: 'Std. Dev.',
  },
  [MEDIAN]: {
    id: `project.dataSource.fields.details.${MEDIAN}`,
    defaultMessage: 'Median',
  },
  [PERCENTILE_10]: {
    id: `project.dataSource.fields.details.${PERCENTILE_10}`,
    defaultMessage: '10th Percentile',
  },
  [PERCENTILE_25]: {
    id: `project.dataSource.fields.details.${PERCENTILE_25}`,
    defaultMessage: '25th Percentile',
  },
  [PERCENTILE_75]: {
    id: `project.dataSource.fields.details.${PERCENTILE_75}`,
    defaultMessage: '75th Percentile',
  },
  [PERCENTILE_90]: {
    id: `project.dataSource.fields.details.${PERCENTILE_90}`,
    defaultMessage: '90th Percentile',
  },
});
