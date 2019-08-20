import React from 'react';
import { storiesOf } from '@storybook/react';

import { H1 } from './h1.component';

storiesOf('H1', module).add('Default', () => (
  <H1>
    Some title
  </H1>
));

const withStylesProps = {
  customStyles: {
    color: 'red',
    textDecoration: 'underline',
    fontStyle: 'italic',
    fontSize: '30px',
  },
};

storiesOf('H1', module).add('with styles', () => (
  <H1 {...withStylesProps} >
    Some title
  </H1>
));