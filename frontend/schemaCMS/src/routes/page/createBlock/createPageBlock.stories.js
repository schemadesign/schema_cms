import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreatePageBlock } from './createPageBlock.component';
import { NONE } from '../../../modules/pageBlock/pageBlock.constants';

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

storiesOf('CreateBlock', module).add('Default', () => <CreatePageBlock {...defaultProps} />);
