import React from 'react';
import { storiesOf } from '@storybook/react';

import { StateFilter } from './stateFilter.component';

const defaultProps = {};

storiesOf('StateFilter', module).add('Default', () => <StateFilter {...defaultProps} />);
