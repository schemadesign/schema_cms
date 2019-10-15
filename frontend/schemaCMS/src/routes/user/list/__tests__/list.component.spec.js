import React from 'react';
import { shallow } from 'enzyme';

import { List } from '../list.component';

const defaultProps = {
  fetchUsers: Function.prototype,
  users: [],
};

describe('User List: Component', () => {
  const component = props => <List {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with users data', () => {
    const users = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Alan', lastName: 'Watts' }];
    const wrapper = render({ ...defaultProps, users });
    global.expect(wrapper).toMatchSnapshot();
  });
});
