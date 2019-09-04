import React from 'react';
import { storiesOf } from '@storybook/react';

import { PillButtons } from './pillButtons.component';

const defaultProps = {};

storiesOf('Shared Components/PillButtons', module).add('Default', () => <PillButtons {...defaultProps} />);
