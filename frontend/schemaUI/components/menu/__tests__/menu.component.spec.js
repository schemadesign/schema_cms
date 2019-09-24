import React from 'react';
import { shallow } from 'enzyme';

import { MenuComponent } from '../menu.component';

describe('Menu: Component', () => {
  const defaultProps = {};

  const component = props => (
    <MenuComponent {...defaultProps} {...props}>
      items
    </MenuComponent>
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
    const closeButtonProps = {
      customStyles,
      id: 'close-button',
    };
    const wrapper = render({ customStyles, closeButtonProps });
    global.expect(wrapper).toMatchSnapshot();
  });
});
