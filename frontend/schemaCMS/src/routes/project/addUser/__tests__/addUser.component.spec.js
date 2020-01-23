import React from 'react';
import { shallow } from 'enzyme';

import { Button } from '../addUser.styles';
import { AddUser } from '../addUser.component';
import { defaultProps, propsWithUsers } from '../addUser.stories';
import { BackButton } from '../../../../shared/components/navigation';

describe('AddUser: Component', () => {
  const component = props => <AddUser {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with users', () => {
    const wrapper = render(propsWithUsers);
    expect(wrapper).toMatchSnapshot();
  });

  it('should redirect to not-authorized page not admin user', () => {
    jest.spyOn(defaultProps.history, 'push');
    render({ isAdmin: false });
    expect(defaultProps.history.push).toHaveBeenCalledWith('/not-authorized');
  });

  it('should fetch users', async () => {
    jest.spyOn(defaultProps, 'fetchUsers');
    render();

    expect(defaultProps.fetchUsers).toHaveBeenCalled();
  });

  it('should fetch project editors', async () => {
    jest.spyOn(defaultProps, 'fetchProjectEditors');
    await render();

    expect(defaultProps.fetchProjectEditors).toHaveBeenCalledWith({ projectId: '1' });
  });

  it('should go back', () => {
    jest.spyOn(defaultProps.history, 'push');
    const wrapper = render();
    wrapper
      .find(BackButton)
      .at(0)
      .simulate('click');

    expect(defaultProps.history.push).toHaveBeenCalledWith('/project/1/user');
  });

  it('should add user', () => {
    jest.spyOn(propsWithUsers.history, 'push');
    const wrapper = render(propsWithUsers);
    wrapper
      .find(Button)
      .at(1)
      .simulate('click');

    expect(propsWithUsers.history.push).toHaveBeenCalledWith('/user/3/add/1');
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
