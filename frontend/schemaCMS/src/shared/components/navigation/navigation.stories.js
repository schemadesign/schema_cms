import React from 'react';
import { storiesOf } from '@storybook/react';

import { NavigationContainer, BackArrowButton, BackButton, PlusButton, NextButton } from './navigation.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = {};

storiesOf('Shared Components/Navigation', module)
  .addDecorator(withTheme())
  .add('NavigationContainer', () => (
    <NavigationContainer right>
      <BackArrowButton {...defaultProps} />
    </NavigationContainer>
  ))
  .add('BackArrowButton', () => <BackArrowButton {...defaultProps} />)
  .add('BackButton', () => <BackButton {...defaultProps} />)
  .add('PlusButton', () => <PlusButton {...defaultProps} />)
  .add('NextButton', () => <NextButton {...defaultProps} />);
