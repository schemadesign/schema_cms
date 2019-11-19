import React from 'react';
import { storiesOf } from '@storybook/react';

import { Loader } from './loader.component';
import { withTheme } from '../../../.storybook/decorators';

storiesOf('Shared Components|Loader', module)
  .addDecorator(withTheme())
  .add('Default', () => <Loader />);
