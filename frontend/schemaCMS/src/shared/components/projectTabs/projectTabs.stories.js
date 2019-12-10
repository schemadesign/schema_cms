import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { ProjectTabs } from './projectTabs.component';
import { SETTINGS } from './projectTabs.constants';

export const defaultProps = {
  active: SETTINGS,
  url: '/project/1',
};

storiesOf('Shared Components|ProjectTabs', module)
  .addDecorator(withTheme())
  .add('Default', () => <ProjectTabs {...defaultProps} />);
