import React from 'react';
import { shallow } from 'enzyme';

import { Menu } from '../menu.component';

describe('Menu: Component', () => {
  const defaultProps = {};

  const component = props => <Menu {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
