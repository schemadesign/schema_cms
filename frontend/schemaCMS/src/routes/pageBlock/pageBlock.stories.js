import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageBlock } from './pageBlock.component';
import { withTheme } from '../../.storybook/decorators';

export const defaultProps = {
  history: { push: Function.prototype },
  block: {
    page: { id: 1 },
  },
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  fetchPageBlock: Function.prototype,
  removePageBlock: Function.prototype,
  isSubmitting: false,
  match: {
    params: {
      blockId: '1',
    },
  },
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
  values: {},
};

storiesOf('PageBlock', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageBlock {...defaultProps} />);
