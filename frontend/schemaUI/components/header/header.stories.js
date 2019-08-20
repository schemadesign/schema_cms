import React from 'react';
import { storiesOf } from '@storybook/react';

import { Header } from './header.component';

const defaultProps = {
  customStyles: {},
  handleIconClick: () => {},
};

storiesOf('Header', module).add('Default', () => (
  <Header {...defaultProps}>
    <h1>Title</h1>
    <h2>Subtitle</h2>
  </Header>
));
