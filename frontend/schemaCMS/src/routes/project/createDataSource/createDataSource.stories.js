import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDataSource } from './createDataSource.component';

const defaultProps = {};

storiesOf('CreateDataSource', module).add('Default', () => <CreateDataSource {...defaultProps} />);
