import React from 'react';
import { storiesOf } from '@storybook/react';

import { H1 } from './h1.component';

storiesOf('H1', module).add('Default', () => (
  <H1>
    Some title
  </H1>
));

const defaultProps = {
  style: {
    color: 'red',
    'text-decoration': 'underline',
  },
};

storiesOf('H1', module).add('with style', () => (
  <H1 {...defaultProps} >
    Some title
  </H1>
));