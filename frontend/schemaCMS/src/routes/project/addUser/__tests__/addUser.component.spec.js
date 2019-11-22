import React from 'react';
import { shallow } from 'enzyme';

import { Button } from '../addUser.styles';
import { AddUser } from '../addUser.component';
import { defaultProps, propsWithUsers } from '../addUser.stories';
import { BackButton, NextButton } from '../../../../shared/components/navigation';

describe('AddUser: Component', () => {
  const component = props => <AddUser {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with users', () => {
    const wrapper = render(propsWithUsers);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should redirect to not-authorized page not admin user', () => {
    jest.spyOn(defaultProps.history, 'push');
    render({ isAdmin: false });
    expect(defaultProps.history.push).toHaveBeenCalledWith('/not-authorized');
  });

  it('should fetch project', async () => {
    jest.spyOn(defaultProps, 'fetchProject');
    render();
    await Promise.resolve();
    expect(defaultProps.fetchProject).toHaveBeenCalledWith({ projectId: '1' });
  });

  it('should fetch users', async () => {
    jest.spyOn(defaultProps, 'fetchUsers');
    render();
    await Promise.resolve();
    expect(defaultProps.fetchUsers).toHaveBeenCalled();
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

    expect(propsWithUsers.history.push).toHaveBeenCalledWith('/user/2/add/1');
  });

  it('should remove user', () => {
    jest.spyOn(propsWithUsers, 'removeUser');
    const wrapper = render(propsWithUsers);
    wrapper
      .find(Button)
      .at(0)
      .simulate('click');
    wrapper.find(NextButton).simulate('click');

    expect(propsWithUsers.removeUser).toHaveBeenCalledWith({ projectId: '1', userId: 1 });
  });
});
