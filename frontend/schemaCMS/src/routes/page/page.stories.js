import React from 'react';
import { storiesOf } from '@storybook/react';

import { Page } from './page.component';
import { withTheme } from '../../.storybook/decorators';
import { ROLES } from '../../modules/userProfile/userProfile.constants';
import { page } from '../../modules/page/page.mocks';
import { pageTemplates } from '../../modules/pageTemplates/pageTemplates.mocks';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  pageTemplates,
  updatePage: Function.prototype,
  fetchPageTemplates: Function.prototype,
  setTemporaryPageBlocks: Function.prototype,
  fetchPage: jest.fn().mockReturnValue(Promise.resolve({ projectId: 'projectId' })),
  removePage: Function.prototype,
  project: { id: 'projectId' },
  page,
};

storiesOf('Page', module)
  .addDecorator(withTheme())
  .add('Default', () => <Page {...defaultProps} />);
