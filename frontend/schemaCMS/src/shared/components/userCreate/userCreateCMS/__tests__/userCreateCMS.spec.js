import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { UserCreateCMS } from '../userCreateCMS.component';
import { userCreateCMSProps } from '../userCreateCMS.stories';
import { UserCreate } from '../../userCreateComponent/userCreate.component';
import browserHistory from '../../../../utils/history';

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

  it('should redirect on cancel', async () => {
    jest.spyOn(browserHistory, 'push');

    const wrapper = render();

    wrapper
      .dive()
      .dive()
      .find(UserCreate)
      .prop('onCancelClick')({ preventDefault: Function.prototype });

    expect(browserHistory.push).toHaveBeenCalledWith('/user');
  });
});
