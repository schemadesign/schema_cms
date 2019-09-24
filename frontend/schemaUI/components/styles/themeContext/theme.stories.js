import React from 'react';
import { storiesOf } from '@storybook/react';

import { ThemeContext } from '../themeContext';
import { Button } from '../../button';
import { dark } from '../../../utils/theme';

const decorator = story => <ThemeContext.Provider value={{ theme: dark }}>{story()}</ThemeContext.Provider>;

storiesOf('Styles/ThemeContext', module)
  .addDecorator(decorator)
  .add('default', () => <Button>Button</Button>);
