import React from 'react';
import { storiesOf } from '@storybook/react';

import { EditPage } from './editPage.component';
import { withTheme } from '../../../.storybook/decorators';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { page } from '../../../modules/page/page.mocks';
import { pageTemplates } from '../../../modules/pageTemplates/pageTemplates.mocks';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { project } from '../../../modules/project/project.mocks';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  pageTemplates,
  blockTemplates,
  updatePage: Function.prototype,
  fetchPageTemplates: Function.prototype,
  fetchBlockTemplates: Function.prototype,
  removePage: Function.prototype,
  project,
  page,
};

storiesOf('EditPage', module)
  .addDecorator(withTheme())
  .add('Default', () => <EditPage {...defaultProps} />);
