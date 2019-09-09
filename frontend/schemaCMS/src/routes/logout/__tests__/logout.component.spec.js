import React from 'react';
import { shallow } from 'enzyme';

import { Logout } from '../logout.component';

describe('Logout: Component', () => {
  const defaultProps = {};

  const component = props => <Logout {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
