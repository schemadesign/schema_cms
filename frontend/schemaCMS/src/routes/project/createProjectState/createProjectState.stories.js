import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateProjectState } from './createProjectState.component';

const defaultProps = {};

storiesOf('CreateProjectState', module).add('Default', () => <CreateProjectState {...defaultProps} />);
