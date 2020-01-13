import React from 'react';
import { shallow } from 'enzyme';

import { UserList } from '../userList.component';
import { defaultProps, propsWithUsers } from '../userList.stories';
import { LoadingWrapper } from '../../../../shared/components/loadingWrapper';

describe('UserList: Component', () => {
  const component = props => <UserList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with users', async () => {
    propsWithUsers.fetchUsers = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render(propsWithUsers);
    await Promise.resolve();
    const usersList = wrapper.find(LoadingWrapper).dive();
    expect(usersList).toMatchSnapshot();
  });

  it('should call fetchUsers prop on componentDidMount', () => {
    jest.spyOn(defaultProps, 'fetchUsers');
    render();

    expect(defaultProps.fetchUsers).toHaveBeenCalled();
  });
});
