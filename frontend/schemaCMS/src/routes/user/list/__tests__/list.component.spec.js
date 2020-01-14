import React from 'react';
import { shallow } from 'enzyme';

import { List } from '../list.component';

const defaultProps = {
  fetchUsers: Function.prototype,
  isAdmin: true,
  users: [],
};

describe('User List: Component', () => {
  const component = props => <List {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with users data', async () => {
    const fetchUsers = jest.fn().mockReturnValue(Promise.resolve());
    const users = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Alan', lastName: 'Watts' }];
    const wrapper = await render({ users, fetchUsers });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchUsers on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchUsers');

    await render();

    expect(defaultProps.fetchUsers).toHaveBeenCalled();
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchUsers should return error';
    const wrapper = await render({
      fetchUsers: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });
});
