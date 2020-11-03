import React from 'react';
import { shallow } from 'enzyme';

import { MobileMenu } from '../mobileMenu.component';
import { defaultProps } from '../mobileMenu.stories';

describe('MobileMenu: Component', () => {
  const component = props => <MobileMenu {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should show logout popup and hide menu', () => {
    const wrapper = render();
    wrapper.instance().handleToggleMenu();

    expect(wrapper.state().isMenuOpen).toEqual(true);

    wrapper.find('#logoutNavBtn').simulate('click');

    expect(wrapper.state().isMenuOpen).toEqual(false);
    expect(wrapper.state().logoutModalOpen).toEqual(true);
  });
});
