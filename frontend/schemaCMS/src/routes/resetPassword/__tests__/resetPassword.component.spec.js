import React from 'react';
import { shallow } from 'enzyme';

import { ResetPassword } from '../resetPassword.component';

describe('ResetPassword: Component', () => {
  const defaultProps = {};

  const component = props => <ResetPassword {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
