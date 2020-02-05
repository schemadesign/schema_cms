import React from 'react';
import { storiesOf } from '@storybook/react';

import { StateFilterList } from './stateFilterList.component';

const defaultProps = {};

storiesOf('StateFilterList', module).add('Default', () => <StateFilterList {...defaultProps} />);
