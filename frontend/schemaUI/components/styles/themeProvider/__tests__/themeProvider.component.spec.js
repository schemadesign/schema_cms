import React from 'react';
import { shallow } from 'enzyme';

import { ThemeProvider } from '../themeProvider.component';

describe('ThemeProvider: Component', () => {
  const defaultProps = {};

  const component = props => (
    <ThemeProvider {...defaultProps} {...props}>
      children
    </ThemeProvider>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
