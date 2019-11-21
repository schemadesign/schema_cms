import React from 'react';
import { storiesOf } from '@storybook/react';

import { DirectoryList } from './directoryList.component';

const defaultProps = {};

storiesOf('DirectoryList', module).add('Default', () => <DirectoryList {...defaultProps} />);
