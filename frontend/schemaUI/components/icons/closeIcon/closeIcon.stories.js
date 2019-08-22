import React from 'react';
import { storiesOf } from '@storybook/react';

import { CloseIcon } from './closeIcon.component';

storiesOf('Icons/CloseIcon', module).add('Default', () => <CloseIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/CloseIcon', module).add('with custom styles', () => <CloseIcon {...defaultProps} />);
