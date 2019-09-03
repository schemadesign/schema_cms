import React from 'react';
import { storiesOf } from '@storybook/react';

import { PillButtons } from './pillButtons.component';

const defaultProps = {};

storiesOf('PillButtons', module).add('Default', () => <PillButtons {...defaultProps} />);
