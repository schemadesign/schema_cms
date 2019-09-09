import React from 'react';
import { storiesOf } from '@storybook/react';

import { H2 } from './h2.component';

storiesOf('Typography/H2', module).add('Default', () => <H2>Some title</H2>);

const withStylesProps = {
  customStyles: {
    color: '#34c12d',
    textDecoration: 'line-through',
    fontSize: '20px',
  },
};

storiesOf('Typography/H2', module).add('with styles', () => <H2 {...withStylesProps}>Some title with styles</H2>);
