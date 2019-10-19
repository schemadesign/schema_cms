import React from 'react';
import { shallow } from 'enzyme';

import { UserList } from '../userList.component';
import { defaultProps, propsWithUsers } from '../userList.stories';

describe('UserList: Component', () => {
  const component = props => <UserList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with users', () => {
    const wrapper = render(propsWithUsers);
    global.expect(wrapper).toMatchSnapshot();
  });
});
