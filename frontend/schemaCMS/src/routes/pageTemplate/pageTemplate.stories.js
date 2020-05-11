import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageTemplate } from './pageTemplate.component';
import { blockTemplates } from '../../modules/blockTemplates/blockTemplates.mocks';
import { ROLES } from '../../modules/userProfile/userProfile.constants';
import { pageTemplate } from '../../modules/pageTemplates/pageTemplates.mocks';
import { withTheme } from '../../.storybook/decorators';
import { project } from '../../modules/project/project.mocks';

export const defaultProps = {
  pageTemplate,
  blockTemplates,
  project,
  userRole: ROLES.ADMIN,
  updatePageTemplate: Function.prototype,
  fetchPageTemplate: jest.fn().mockReturnValue(Promise.resolve({ project: 'projectId' })),
  fetchBlockTemplates: Function.prototype,
  removePageTemplate: jest.fn().mockReturnValue(Promise.resolve({})),
};

storiesOf('PageTemplate', module)
  .addDecorator(withTheme())
  .add('Default', () => <PageTemplate {...defaultProps} />);
