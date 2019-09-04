import React from 'react';
import { storiesOf } from '@storybook/react';

import { H1 } from './h1.component';

storiesOf('Typography.H1', module).add('Default', () => <H1>Some title</H1>);

const withStylesProps = {
  customStyles: {
    color: 'red',
    textDecoration: 'underline',
    fontStyle: 'italic',
    fontSize: '30px',
  },
};

storiesOf('Typography/H1', module).add('with styles', () => <H1 {...withStylesProps}>Some title</H1>);

storiesOf('Typography/H1', module).add('with attributes', () => (
  <H1 title="Oh! It's title." id="title-with-attribute">
    Title with attributes
    <span style={{ fontSize: '10px', color: '#777', display: 'block' }}>
      (hover on it to show value of title attribute)
    </span>
  </H1>
));

storiesOf('Typography/H1', module).add('with custom theme', () => {
  const theme = {
    typography: {
      h1: {
        fontFamily: 'serif',
        size: '30px',
        color: 'orange',
        border: '1px solid gray',
        padding: '10px',
        display: 'inline-block',
      },
    },
  };

  return <H1 theme={theme}>Title styled by theme</H1>;
});
