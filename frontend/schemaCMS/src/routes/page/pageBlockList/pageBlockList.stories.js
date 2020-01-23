import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageBlockList } from './pageBlockList.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  values: [
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
    folder: {
      id: '1',
    },
  },
  temporaryPageBlocks: [],
  saveTemporaryBlocks: Function.prototype,
  fetchPageBlocks: Function.prototype,
  fetchPage: Function.prototype,
  handleSubmit: Function.prototype,
  setValues: Function.prototype,
  isSubmitting: false,
  dirty: false,
  match: {
    params: {
      pageId: '1',
    },
  },
  intl,
  history,
};

const emptyBlocksProps = {
  ...defaultProps,
  values: [],
};

storiesOf('Page|PageBlockList', module)
  .addDecorator(withTheme())
  .add('No data', () => <PageBlockList {...emptyBlocksProps} />)
  .add('Default', () => <PageBlockList {...defaultProps} />);
