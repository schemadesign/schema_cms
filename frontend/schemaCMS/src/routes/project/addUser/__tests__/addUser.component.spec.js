import React from 'react';
import { shallow } from 'enzyme';

import { AddUserComponent as AddUser } from '../addUser.component';

describe('AddUser: Component', () => {
  const defaultProps = {};

  const component = props => <AddUser {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
