import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreatePageBlock } from './createPageBlock.component';
import { NONE } from '../../../modules/pageBlock/pageBlock.constants';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
  values: {
    type: NONE,
  },
  history: {
    push: Function.prototype,
  },
  match: {
    params: {
      pageId: '1',
    },
  },
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
  setFieldValue: Function.prototype,
};

storiesOf('CreatePageBlock', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreatePageBlock {...defaultProps} />);
