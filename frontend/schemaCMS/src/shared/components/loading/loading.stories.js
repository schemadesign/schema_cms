import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { Loading } from './loading.component';

storiesOf('Shared Components|Loading', module)
  .addDecorator(withTheme())
  .add('Default', () => <Loading />);
