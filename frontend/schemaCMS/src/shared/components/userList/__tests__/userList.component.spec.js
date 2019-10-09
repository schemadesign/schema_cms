import React from 'react';
import { shallow } from 'enzyme';

import { UserListComponent as UserList } from '../userList.component';

describe('UserList: Component', () => {
  const defaultProps = {};

  const component = props => <UserList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
