import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { ErrorContainer } from './errorContainer.component';
import { ERROR_TYPES } from './errorContainer.constants';

export const pageErrorProps = {
  type: ERROR_TYPES.PAGE,
};

storiesOf('Shared Components|ErrorContainer', module)
  .addDecorator(withTheme())
  .add('Default', () => <ErrorContainer>Default error</ErrorContainer>)
  .add('Page error', () => <ErrorContainer {...pageErrorProps}>Page error</ErrorContainer>);
