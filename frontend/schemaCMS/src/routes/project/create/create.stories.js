import React from 'react';
import { storiesOf } from '@storybook/react';

import { Create } from './create.component';
import { PROJECT_TITLE } from '../../../modules/project/project.constants';

const defaultProps = {
  values: {
    [PROJECT_TITLE]: 'title',
  },
  errors: {},
};

storiesOf('Project/Create', module).add('Default', () => <Create {...defaultProps} />);
