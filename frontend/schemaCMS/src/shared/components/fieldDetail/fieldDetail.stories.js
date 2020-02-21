import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { intl } from '../../../.storybook/helpers';
import { FieldDetail } from './fieldDetail.component';
import {
  COUNT,
  MAX,
  MEAN,
  MEDIAN,
  MIN,
  NAN,
  PERCENTILE_10,
  PERCENTILE_25,
  SAMPLE,
  STD,
  TYPE,
  UNIQUE,
} from './fieldDetail.constants';

const long = `
  Donec at erat dictum, congue lorem at, gravida magna.
  Phasellus nulla turpis, hendrerit vulputate velit ut,
  semper condimentum libero. Maecenas sodales at nisl non pellentesque.
`;

export const defaultProps = {
  id: 'firstName',
  step: 0,
  data: {
    someProp: null,
    freq: 6,
    [COUNT]: 127,
    [TYPE]: 'Text',
    [MAX]: 100,
    [MEAN]: 4,
    [MEDIAN]: 4.5,
    [MIN]: 1,
    [NAN]: 2,
    [STD]: 23.333282731964,
    [SAMPLE]: long,
    [UNIQUE]: 99,
    [PERCENTILE_10]: long,
    [PERCENTILE_25]: 100283.30095,
  },
  intl,
};

storiesOf('Shared Components|FieldDetail', module)
  .addDecorator(withTheme())
  .add('Default', () => <FieldDetail {...defaultProps} />);
