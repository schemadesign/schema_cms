import React from 'react';
import { storiesOf } from '@storybook/react';

import { JobDetail } from './jobDetail.component';

const defaultProps = {};

storiesOf('JobDetail', module).add('Default', () => <JobDetail {...defaultProps} />);
