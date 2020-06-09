import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreatePage } from './createPage.component';
import { withTheme } from '../../../.storybook/decorators';
import { pageTemplates } from '../../../modules/pageTemplates/pageTemplates.mocks';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { project } from '../../../modules/project/project.mocks';
import { internalConnections } from '../../../modules/sections/sections.mocks';
import { tagCategories } from '../../../modules/tagCategory/tagCategory.mocks';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  createPage: Function.prototype,
  project,
  section: {
    id: 1,
    name: 'Section',
  },
  fetchPageAdditionalData: Function.prototype,
  pageAdditionalData: {
    internalConnections,
    tagCategories,
    pageTemplates,
    states: [],
  },
};

storiesOf('CreatePage', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreatePage {...defaultProps} />);
