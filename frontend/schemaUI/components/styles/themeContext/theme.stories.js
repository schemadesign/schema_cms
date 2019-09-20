import React from 'react';
import { storiesOf } from '@storybook/react';

import { ThemeContext } from '../themeContext';
import { Button } from '../../button';
import { secondary } from '../../../utils/theme';

const decorator = story => <ThemeContext.Provider value={{ theme: secondary }}>{story()}</ThemeContext.Provider>;

storiesOf('Styles/ThemeContext', module)
  .addDecorator(decorator)
  .add('default', () => <Button>Button</Button>);
