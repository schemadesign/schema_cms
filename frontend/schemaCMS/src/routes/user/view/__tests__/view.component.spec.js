import React from 'react';
import { shallow } from 'enzyme';

import { View } from '../view.component';
import { defaultProps, adminProps } from '../view.stories';
// import { Link } from '../../../../theme/typography';
import { BackButton, NextButton } from '../../../../shared/components/navigation';

describe('View: Component', () => {
  const component = props => <View {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly for admin user', () => {
    const wrapper = render(adminProps);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should fetch user', () => {
    jest.spyOn(defaultProps, 'fetchUser');

    render();

    expect(defaultProps.fetchUser).toBeCalledWith({ userId: '1' });
  });

  it('should remove user', () => {
    jest.spyOn(defaultProps, 'removeUser');

    const wrapper = render();

    wrapper.find(NextButton).simulate('click');

    expect(defaultProps.removeUser).toBeCalledWith({ userId: '1' });
  });

  // it('should call makeAdmin', async () => {
  //   jest.spyOn(adminProps, 'makeAdmin');

  //   const wrapper = render(adminProps);

  //   await Promise.resolve();

  //   wrapper
  //     .find(Link)
  //     .dive()
  //     .at(1)
  //     .simulate('click');

  //   expect(adminProps.makeAdmin).toBeCalledWith({ userId: '1' });
  // });

  it('should go back', () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render();
    wrapper
      .find(BackButton)
      .at(0)
      .simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/user');
  });
});
