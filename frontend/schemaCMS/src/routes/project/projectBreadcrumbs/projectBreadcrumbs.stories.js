import React from 'react';
import { storiesOf } from '@storybook/react';

import { ProjectBreadcrumbs } from './projectBreadcrumbs.component';

export const defaultProps = {};

storiesOf('ProjectBreadcrumbs', module).add('Default', () => <ProjectBreadcrumbs {...defaultProps} />);
