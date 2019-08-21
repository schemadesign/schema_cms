import React from 'react';
import { storiesOf } from '@storybook/react';

import { CloseIcon } from './closeIcon.component';

storiesOf('CloseIcon', module).add('Default', () => <CloseIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('CloseIcon', module).add('with custom styles', () => <CloseIcon {...defaultProps} />);
