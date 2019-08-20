import React from 'react';
import { storiesOf } from '@storybook/react';

import { H3 } from './h3.component';

storiesOf('H3', module).add('Default', () => (
  <H3>
    Is a nice H3 title.
  </H3>
));

const withStylesProps = {
  customStyles: {
    color: 'blue',
    fontStyle: 'italic',
    letterSpacing: '0.3em',
  },
};

storiesOf('H3', module).add('with styles', () => (
  <H3 {...withStylesProps} >
    This title has got custom styles
  </H3>
));
