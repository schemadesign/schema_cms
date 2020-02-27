import React from 'react';
import { storiesOf } from '@storybook/react';

import { Templates } from './templates.component';
import { intl, history } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  intl,
  history,
  match: {
    params: {
      projectId: 'projectId',
    },
  },
  userRole: ROLES.ADMIN,
  templates: {
    blocks: 0,
    pages: 0,
    states: 0,
    filters: 0,
  },
  fetchTemplates: Function.prototype,
};

storiesOf('Templates', module)
  .addDecorator(withTheme())
  .add('Default', () => <Templates {...defaultProps} />);
