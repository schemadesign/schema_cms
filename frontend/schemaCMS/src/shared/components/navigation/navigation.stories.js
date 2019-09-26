import React from 'react';
import { storiesOf } from '@storybook/react';

import { NavigationContainer, BackArrowButton, BackButton, PlusButton, NextButton } from './navigation.component';

const defaultProps = {};

storiesOf('Navigation', module)
  .add('NavigationContainer', () => <NavigationContainer {...defaultProps} />)
  .add('BackArrowButton', () => <BackArrowButton {...defaultProps} />)
  .add('BackButton', () => <BackButton {...defaultProps} />)
  .add('PlusButton', () => <PlusButton {...defaultProps} />)
  .add('NextButton', () => <NextButton {...defaultProps} />);
