import requireContext from 'require-context.macro';
import { configure, addDecorator } from '@storybook/react';
import { FontDecorator } from './decorators';

function loadStories() {
  // automatically import all story js files that end with *.stories.js
  const req = requireContext('../components', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

addDecorator(FontDecorator);

configure(loadStories, module);
