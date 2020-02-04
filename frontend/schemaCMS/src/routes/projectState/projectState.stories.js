import React from 'react';
import { storiesOf } from '@storybook/react';

import { ProjectState } from './projectState.component';

const defaultProps = {};

storiesOf('ProjectState', module).add('Default', () => <ProjectState {...defaultProps} />);
