import React from 'react';
import { storiesOf } from '@storybook/react';

import { ProjectStateList } from './projectStateList.component';

const defaultProps = {};

storiesOf('ProjectStateList', module).add('Default', () => <ProjectStateList {...defaultProps} />);
