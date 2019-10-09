import React from 'react';
import { shallow } from 'enzyme';

import { UserCreateComponent as UserCreate } from '../userCreate.component';

describe('UserCreate: Component', () => {
  const defaultProps = {};

  const component = props => <UserCreate {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
