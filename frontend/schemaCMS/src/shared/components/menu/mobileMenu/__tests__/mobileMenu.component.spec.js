import React from 'react';
import { shallow } from 'enzyme';

import { MobileMenuComponent as MobileMenu } from '../mobileMenu.component';

describe('MobileMenu: Component', () => {
  const defaultProps = {};

  const component = props => <MobileMenu {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
