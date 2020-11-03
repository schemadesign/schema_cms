import React from 'react';
import { shallow } from 'enzyme';

import { UserDetails } from '../userDetails.component';
import { defaultProps } from '../userDetails.stories';
import { NextButton } from '../../../../shared/components/navigation';

describe('UserDetails: Component', () => {
  const component = props => <UserDetails {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loading', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const wrapper = await render({
      fetchUser: jest.fn().mockReturnValue(Promise.resolve()),
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch user', () => {
    jest.spyOn(defaultProps, 'fetchUser');

    render();

    expect(defaultProps.fetchUser).toBeCalledWith({ userId: '1' });
  });

  it('should remove user', () => {
    jest.spyOn(defaultProps, 'removeEditorFromProject');

    const wrapper = render();

    wrapper.find(NextButton).simulate('click');

    expect(defaultProps.removeEditorFromProject).toBeCalledWith({ isDetails: true, projectId: '1', userId: '1' });
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchUser should return error';
    const wrapper = await render({
      fetchUser: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });
});
