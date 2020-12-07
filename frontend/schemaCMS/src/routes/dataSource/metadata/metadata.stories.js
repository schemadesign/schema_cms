import React from 'react';
import { storiesOf } from '@storybook/react';

import { Metadata } from './metadata.component';
import { metadata } from '../../../modules/metadata/metadata.mocks';
import { project } from '../../../modules/project/project.mocks';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  metadata,
  project,
  fetchMetadata: Function.prototype,
  updateMetadata: Function.prototype,
  fetchPreview: Function.prototype,
  dataSource: {
    id: 1,
    activeJob: {
      id: 1,
    },
  },
  previewData: {},
  userRole: ROLES.ADMIN,
};

storiesOf('Metadata', module).add('Default', () => <Metadata {...defaultProps} />);
