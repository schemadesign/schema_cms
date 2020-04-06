import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageTemplates } from './pageTemplates.component';
import { withTheme } from '../../../.storybook/decorators';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { pageTemplates } from '../../../modules/pageTemplates/pageTemplates.mocks';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  pageTemplates,
  project: {
    id: 1,
  },
  fetchPageTemplates: Function.prototype,
};

storiesOf('PageTemplates', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageTemplates {...defaultProps} />);
