import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreatePage } from './createPage.component';
import { withTheme } from '../../../.storybook/decorators';
import { pageTemplates } from '../../../modules/pageTemplates/pageTemplates.mocks';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';

export const defaultProps = {
  pageTemplates,
  blockTemplates,
  userRole: ROLES.ADMIN,
  createPage: Function.prototype,
  fetchPageTemplates: Function.prototype,
  fetchBlockTemplates: Function.prototype,
  project: { id: 'projectId' },
  section: {
    id: 1,
    name: 'Section',
  },
};

storiesOf('CreatePage', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreatePage {...defaultProps} />);
