import React from 'react';
import { shallow } from 'enzyme';

import { MobileMenu } from '../mobileMenu.component';
import { defaultProps } from '../mobileMenu.stories';

describe('MobileMenu: Component', () => {
  const component = props => <MobileMenu {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
