import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { UserCreateCMS } from '../userCreateCMS.component';
import { userCreateCMSProps } from '../userCreateCMS.stories';

describe('UserCreateCMS: Component', () => {
  const component = props => <UserCreateCMS {...userCreateCMSProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should call createUserCMS on submit form', async () => {
    jest.spyOn(userCreateCMSProps, 'createUserCMS');

    const wrapper = render();

    wrapper.find(Formik).prop('onSubmit')(
      { data: 'data' },
      { setSubmitting: Function.prototype, setErrors: Function.prototype }
    );

    expect(userCreateCMSProps.createUserCMS).toHaveBeenCalledTimes(1);
  });
});
