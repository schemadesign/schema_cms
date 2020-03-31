import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreatePage } from './createPage.component';
import { withTheme } from '../../../.storybook/decorators';
import { pageTemplates } from '../../../modules/pageTemplates/pageTemplates.mocks';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  pageTemplates,
  userRole: ROLES.ADMIN,
  createPage: Function.prototype,
  fetchPageTemplates: Function.prototype,
  project: { id: 'projectId' },
};

storiesOf('CreatePage', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreatePage {...defaultProps} />);
