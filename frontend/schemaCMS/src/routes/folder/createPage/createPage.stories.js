import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreatePage } from './createPage.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';

export const defaultProps = {
  values: {
    title: 'title',
    description: 'description',
    keywords: 'keywords',
  },
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
  isValid: true,
  isSubmitting: false,
  history,
  intl,
  match: {
    params: {
      folderId: 1,
    },
  },
};

storiesOf('Folder|CreatePage', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreatePage {...defaultProps} />);
