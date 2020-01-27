import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDataSourceTag } from './createDataSourceTag.component';

const defaultProps = {};

storiesOf('CreateDataSourceTag', module).add('Default', () => <CreateDataSourceTag {...defaultProps} />);
