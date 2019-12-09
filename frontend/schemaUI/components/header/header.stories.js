import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import { Header } from './header.component';
import { withTheme } from '../../.storybook/decorators';

const defaultPropsWithCustomStyles = {
  customStyles: {
    backgroundColor: 'red',
  },
  showButton: true,
};

const defaultPropsWithCustomIcon = {
  iconComponent: <div style={{ color: 'white', fontSize: '10px', padding: 10 }}>icon</div>,
  showButton: true,
};

storiesOf('Header', module)
  .addDecorator(withTheme())
  .add('Default', () => (
    <Header>
      <Fragment>
        <h1>Title</h1>
        <h2>Subtitle</h2>
      </Fragment>
    </Header>
  ))
  .add('with custom styles', () => (
    <Header {...defaultPropsWithCustomStyles}>
      <Fragment>
        <h1>Title</h1>
        <h2>Subtitle</h2>
      </Fragment>
    </Header>
  ))
  .add('with custom icon', () => (
    <Header {...defaultPropsWithCustomIcon}>
      <Fragment>
        <h1>Title</h1>
        <h2>Subtitle</h2>
      </Fragment>
    </Header>
  ));
