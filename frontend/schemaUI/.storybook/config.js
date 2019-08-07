import requireContext from 'require-context.macro';
import { configure } from '@storybook/react';

function loadStories() {
  // automatically import all story js files that end with *.stories.js
  const req = requireContext('../components', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
