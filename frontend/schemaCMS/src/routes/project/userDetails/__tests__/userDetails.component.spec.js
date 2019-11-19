import React from 'react';
import { shallow } from 'enzyme';

import { UserDetails } from '../userDetails.component';
import { defaultProps } from '../userDetails.stories';
import { BackButton } from '../../../../shared/components/navigation';
import { ModalButton } from '../../../../shared/components/modal/modal.styles';

describe('UserDetails: Component', () => {
  const component = props => <UserDetails {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should fetch user', () => {
    jest.spyOn(defaultProps, 'fetchUser');

    render();

    expect(defaultProps.fetchUser).toBeCalledWith({ userId: '1' });
  });

  it('should go back', () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render(defaultProps);
    wrapper.find(BackButton).simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/project/1/user');
  });

  it('should remove user', () => {
    jest.spyOn(defaultProps, 'removeEditorFromProject');

    const wrapper = render();

    wrapper
      .find(ModalButton)
      .at(1)
      .simulate('click');

    expect(defaultProps.removeEditorFromProject).toBeCalledWith({ isDetails: true, projectId: '1', userId: '1' });
  });
});