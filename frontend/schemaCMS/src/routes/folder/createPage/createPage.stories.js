import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreatePage } from './createPage.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  intl: {
    formatMessage: Function.prototype,
  },
  values: {},
  match: {
    params: {
      folderId: 1,
    },
  },
  history: {
    push: Function.prototype,
  },
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
  isValid: true,
  isSubmitting: false,
};

storiesOf('Folder|CreatePage', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreatePage {...defaultProps} />);
