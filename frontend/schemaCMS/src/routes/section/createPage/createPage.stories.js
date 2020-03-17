import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreatePage } from './createPage.component';

export const defaultProps = {};

storiesOf('CreatePage', module).add('Default', () => <CreatePage {...defaultProps} />);
