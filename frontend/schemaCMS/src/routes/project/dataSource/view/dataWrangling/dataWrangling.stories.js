import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataWrangling } from './dataWrangling.component';

const defaultProps = {};

storiesOf('DataWrangling', module).add('Default', () => <DataWrangling {...defaultProps} />);
