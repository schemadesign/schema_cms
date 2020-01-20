import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreatePageBlock } from './createPageBlock.component';
import { NONE } from '../../../modules/pageBlock/pageBlock.constants';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  values: {
    type: NONE,
  },
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
  setFieldValue: Function.prototype,
  isSubmitting: false,
  history,
  intl,
  match: {
    params: {
      pageId: '1',
    },
  },
};

storiesOf('Page|CreatePageBlock', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreatePageBlock {...defaultProps} />);
