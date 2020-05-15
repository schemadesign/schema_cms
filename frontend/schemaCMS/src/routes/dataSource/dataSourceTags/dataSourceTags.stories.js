import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceTags } from './dataSourceTags.component';
import { project } from '../../../modules/project/project.mocks';
import { tagCategories } from '../../../modules/tagCategory/tagCategory.mocks';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  fetchTagCategories: Function.prototype,
  fetchDataSourceTags: Function.prototype,
  updateDataSourceTags: Function.prototype,
  project,
  dataSource: { id: 1 },
  tagCategories,
  userRole: ROLES.ADMIN,
  tags: [],
};

storiesOf('DataSourceTags', module).add('Default', () => <DataSourceTags {...defaultProps} />);
