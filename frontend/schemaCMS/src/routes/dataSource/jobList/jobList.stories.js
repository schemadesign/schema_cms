import React from 'react';
import { storiesOf } from '@storybook/react';

import { JobList } from './jobList.component';

const defaultProps = {};

storiesOf('JobList', module).add('Default', () => <JobList {...defaultProps} />);
