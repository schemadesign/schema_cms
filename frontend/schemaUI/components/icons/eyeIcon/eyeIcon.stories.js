import React from 'react';
import { storiesOf } from '@storybook/react';

import { EyeIcon } from './eyeIcon.component';

storiesOf('Icons/EyeIcon', module).add('Default', () => <EyeIcon />);

const defaultProps = { customStyles: { stroke: 'blue' } };
storiesOf('Icons/EyeIcon', module).add('with custom styles', () => <EyeIcon {...defaultProps} />);
