import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreatePage } from './createPage.component';
import { withTheme } from '../../../.storybook/decorators';
import { pageTemplates } from '../../../modules/pageTemplates/pageTemplates.mocks';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { blockTemplates } from '../../../modules/blockTemplates/blockTemplates.mocks';
import { project } from '../../../modules/project/project.mocks';
import { internalConnections } from '../../../modules/sections/sections.mocks';
import { tagCategories } from '../../../modules/tagCategory/tagCategory.mocks';

export const defaultProps = {
  pageTemplates,
  blockTemplates,
  userRole: ROLES.ADMIN,
  createPage: Function.prototype,
  fetchPageTemplates: Function.prototype,
  fetchBlockTemplates: Function.prototype,
  project,
  section: {
    id: 1,
    name: 'Section',
  },
  fetchInternalConnections: Function.prototype,
  internalConnections,
  fetchTagCategories: Function.prototype,
  tagCategories,
};

storiesOf('CreatePage', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreatePage {...defaultProps} />);
