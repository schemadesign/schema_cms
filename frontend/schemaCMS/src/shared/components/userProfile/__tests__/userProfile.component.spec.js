import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { UserProfile } from '../userProfile.component';
import { defaultProps } from '../userProfile.stories';
import { BackButton, NextButton } from '../../navigation';

describe('UserProfile: Component', () => {
  const component = props => <UserProfile {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly form', () => {
    const wrapper = render()
      .find(Formik)
      .dive();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly form for user settings', () => {
    const wrapper = render({ isSettings: true })
      .find(Formik)
      .dive();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call updateMe on form submit', () => {
    jest.spyOn(defaultProps, 'updateMe');

    const wrapper = render();

    wrapper
      .find(Formik)
      .dive()
      .find(NextButton)
      .simulate('click');
    expect(defaultProps.updateMe).toBeCalled();
  });

  it('should call makeAdmin on form submit', () => {
    jest.spyOn(defaultProps, 'makeAdmin');

    const wrapper = render();

    wrapper
      .find(Formik)
      .dive()
      .find(NextButton)
      .simulate('click');
    expect(defaultProps.makeAdmin).toBeCalled();
  });

  it('should call handleChange on change of TextInput value', () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render({ isSettings: false });
    wrapper
      .find(Formik)
      .dive()
      .find(BackButton)
      .simulate('click');

    expect(defaultProps.history.push).toBeCalled();
  });
});
