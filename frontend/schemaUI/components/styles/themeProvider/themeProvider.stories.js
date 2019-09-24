import React from 'react';
import { storiesOf } from '@storybook/react';

import { ThemeProvider } from './themeProvider.component';
import { Button } from '../../button';
import { dark } from '../../../utils/theme';

storiesOf('Styles/ThemeProvider', module)
  .add('default', () => (
    <ThemeProvider>
      <Button>Button</Button>
    </ThemeProvider>
  ))
  .add('with dark theme', () => (
    <ThemeProvider theme={dark}>
      <Button>Button</Button>
    </ThemeProvider>
  ));
