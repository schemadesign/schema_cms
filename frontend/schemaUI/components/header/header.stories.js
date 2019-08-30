import React from 'react';
import { storiesOf } from '@storybook/react';

import { Header } from './header.component';

storiesOf('Header', module).add('Default', () => (
  <Header>
    <>
      <h1>Title</h1>
      <h2>Subtitle</h2>
    </>
  </Header>
));

const defaultPropsWithCustomStyles = {
  customStyles: {
    backgroundColor: 'red',
  },
};

storiesOf('Header', module).add('with custom styles', () => (
  <Header {...defaultPropsWithCustomStyles}>
    <>
      <h1>Title</h1>
      <h2>Subtitle</h2>
    </>
  </Header>
));

const defaultPropsWithCustomIcon = {
  iconComponent: <div style={{ color: 'black', fontSize: '10px', padding: 10 }}>icon</div>,
};

storiesOf('Header', module).add('with custom icon', () => (
  <Header {...defaultPropsWithCustomIcon}>
    <>
      <h1>Title</h1>
      <h2>Subtitle</h2>
    </>
  </Header>
));
