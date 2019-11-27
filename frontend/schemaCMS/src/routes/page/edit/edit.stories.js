import React from 'react';
import { storiesOf } from '@storybook/react';

import { Edit } from './edit.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  page: { directory: { id: '1' } },
  values: {
    title: 'title',
    description: 'description',
    keywords: 'keywords',
  },
  fetchPage: Function.prototype,
  handleChange: Function.prototype,
  handleSubmit: Function.prototype,
  match: {
    params: {
      pageId: '1',
    },
  },
  history: {
    push: Function.prototype,
  },
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
};

storiesOf('Edit', module)
  .addDecorator(withTheme())
  .add('Default', () => <Edit {...defaultProps} />);