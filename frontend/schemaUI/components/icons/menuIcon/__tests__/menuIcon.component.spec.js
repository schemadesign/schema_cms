import React from 'react';
import { shallow } from 'enzyme';

import { MenuIcon } from '../menuIcon.component';

describe('MenuIcon: Component', () => {
  const defaultProps = {};

  const component = props => <MenuIcon {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const customStyles = {
      fill: 'blue',
    };

    const wrapper = render({ customStyles });
    global.expect(wrapper).toMatchSnapshot();
  });
});
