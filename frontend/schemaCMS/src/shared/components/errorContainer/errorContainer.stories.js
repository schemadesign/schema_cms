import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { ErrorContainer } from './errorContainer.component';
import { ERROR_TYPES, NOT_FOUND_RAW } from './errorContainer.constants';

export const pageErrorProps = {
  type: ERROR_TYPES.PAGE,
  error: 'Page error',
};

const customError = (
  <Fragment>
    <h1>Error title</h1>
    <h2>Subtitle</h2>
  </Fragment>
);

const codeErrorProps = {
  type: ERROR_TYPES.PAGE,
  error: {
    code: NOT_FOUND_RAW,
  },
};

const otherCodeErrorProps = {
  type: ERROR_TYPES.PAGE,
  error: {
    code: 'some_code',
  },
};

storiesOf('Shared Components|ErrorContainer', module)
  .addDecorator(withTheme())
  .add('Default', () => <ErrorContainer error="Default error" />)
  .add('Custom', () => <ErrorContainer error={customError} />)
  .add('Page error', () => <ErrorContainer {...pageErrorProps} />)
  .add('Not found Code', () => <ErrorContainer {...codeErrorProps} />)
  .add('Not identified Code', () => <ErrorContainer {...otherCodeErrorProps} />);
