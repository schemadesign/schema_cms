import React from 'react';
import { storiesOf } from '@storybook/react';

import { ProjectStateForm } from './projectStateForm.component';

const defaultProps = {};

storiesOf('ProjectStateForm', module).add('Default', () => <ProjectStateForm {...defaultProps} />);
