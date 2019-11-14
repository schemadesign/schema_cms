import React from 'react';
import { storiesOf } from '@storybook/react';

import { LoaderWrapper } from './loaderWrapper.component';

const defaultProps = {};

storiesOf('LoaderWrapper', module).add('Default', () => <LoaderWrapper {...defaultProps} />);
