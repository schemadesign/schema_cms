import React from 'react';
import { storiesOf } from '@storybook/react';

import { Page } from './page.component';

export const defaultProps = {};

storiesOf('Page', module).add('Default', () => <Page {...defaultProps} />);
