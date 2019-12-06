import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageBlock } from './pageBlock.component';
import { withTheme } from '../../.storybook/decorators';
import { history, intl } from '../../.storybook/helpers';

export const defaultProps = {
  values: {},
  block: {
    page: { id: 1 },
  },
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  fetchPageBlock: Function.prototype,
  removePageBlock: Function.prototype,
  isSubmitting: false,
  history,
  intl,
  match: {
    params: {
      blockId: '1',
    },
  },
};

storiesOf('PageBlock', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageBlock {...defaultProps} />);
