import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { UserProfile } from '../userProfile.component';
import { Form } from '../userProfile.styles';
import { defaultProps } from '../userProfile.stories';
import { BackButton } from '../../navigation';
import { INITIAL_VALUES } from '../../../../modules/userProfile/userProfile.constants';

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

  it('should call updateMe on Formik submit', () => {
    jest.spyOn(defaultProps, 'updateMe');

    const values = { sample: 'test' };
    const wrapper = render({ isSettings: true });

    wrapper.find(Formik).prop('onSubmit')(values);
    expect(defaultProps.updateMe).toBeCalledWith(values);
  });

  it('should call makeAdmin on Formik submit', () => {
    jest.spyOn(defaultProps, 'makeAdmin');

    const userId = 'id';
    const match = { params: { userId } };
    const wrapper = render({ match });

    wrapper.find(Formik).prop('onSubmit')();
    expect(defaultProps.makeAdmin).toBeCalledWith({ userId });
  });

  it('should call handleSubmit on form submit', () => {
    const renderProps = {
      values: INITIAL_VALUES,
      handleSubmit: Function.prototype,
    };

    jest.spyOn(renderProps, 'handleSubmit');

    const instance = new UserProfile(defaultProps);
    const wrapper = shallow(instance.renderContent(renderProps));
    const sample = { sample: 'test' };

    wrapper.find(Form).simulate('submit', sample);

    expect(renderProps.handleSubmit).toBeCalledWith(sample);
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
