import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { Settings } from '../settings.component';
import { defaultProps } from '../settings.stories';
import { Link } from '../../../theme/typography';
import { BackButton } from '../../../shared/components/navigation';
import { AUTH_METHODS } from '../../../modules/userProfile/userProfile.constants';

describe('Settings: Component', () => {
  const component = props => <Settings {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

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

  it('should render form without reset password link', () => {
    const wrapper = render({ userData: { authMethod: AUTH_METHODS.GMAIL } })
      .find(Formik)
      .dive();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call clearProject prop on componentDidMount', () => {
    jest.spyOn(defaultProps, 'clearProject');
    render();

    expect(defaultProps.clearProject).toHaveBeenCalled();
  });

  it('should call updateMe on Formik submit', async () => {
    jest.spyOn(defaultProps, 'updateMe');

    const values = { sample: 'test' };
    const wrapper = render(defaultProps);

    await wrapper.find(Formik).prop('onSubmit')(values, { setSubmitting: Function.prototype });
    expect(defaultProps.updateMe).toBeCalledWith(values);
  });

  it('should reset password', () => {
    jest.spyOn(defaultProps.history, 'push');

    const wrapper = render(defaultProps);
    wrapper
      .find(Formik)
      .dive()
      .find(Link)
      .simulate('click');

    expect(defaultProps.history.push).toBeCalledWith('/reset-password');
  });

  it('should go back', () => {
    jest.spyOn(defaultProps.history, 'goBack');

    const wrapper = render(defaultProps);
    wrapper
      .find(Formik)
      .dive()
      .find(BackButton)
      .simulate('click');

    expect(defaultProps.history.goBack).toBeCalled();
  });
});
