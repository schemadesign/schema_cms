import React from 'react';
import { storiesOf } from '@storybook/react';

import { Edit } from './edit.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  page: { folder: { id: '1' } },
  values: {
    title: 'title',
    description: 'description',
    keywords: 'keywords',
  },
  fetchPage: Function.prototype,
  handleChange: Function.prototype,
  handleSubmit: Function.prototype,
  removePage: Function.prototype,
  isValid: true,
  isSubmitting: false,
  history,
  intl,
  match: {
    params: {
      pageId: '1',
    },
  },
};

storiesOf('Page|Edit', module)
  .addDecorator(withTheme())
  .add('Default', () => <Edit {...defaultProps} />);
