import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockList } from './blockList.component';
import { withRouter, withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  blocks: [
    {
      name: 'block 1',
      isActive: true,
      id: 1,
    },
    {
      name: 'block 2',
      isActive: false,
      id: 2,
    },
  ],
  page: {
    directory: {
      id: '1',
    },
  },
  fetchBlocks: Function.prototype,
  fetchPage: Function.prototype,
  setBlocks: Function.prototype,
  match: {
    params: {
      pageId: '1',
    },
  },
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
  history: { push: Function.prototype },
};

storiesOf('BlockList', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Default', () => <BlockList {...defaultProps} />);
