import React from 'react';
import { shallow } from 'enzyme';

import { Menu } from '../menu.component';

describe('Menu: Component', () => {
  const defaultProps = {};

  const component = props => (
    <Menu {...defaultProps} {...props}>
      items
    </Menu>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render opened', () => {
    const wrapper = render({ open: true });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should with custom styles', () => {
    const customStyles = {
      backgroundColor: 'black',
    };
    const customCloseButtonStyles = {
      backgroundColor: 'black',
    };
    const wrapper = render({ customStyles, customCloseButtonStyles });
    global.expect(wrapper).toMatchSnapshot();
  });
});
