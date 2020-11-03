import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { UserCreateProject } from '../userCreateProject.component';
import { userCreateProjectProps } from '../userCreateProject.stories';

describe('UserCreateProject: Component', () => {
  const component = props => <UserCreateProject {...userCreateProjectProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    userCreateProjectProps.fetchUser = jest.fn().mockReturnValue(Promise.resolve());
    userCreateProjectProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());

    const wrapper = render();

    await Promise.resolve();
    await Promise.resolve();

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should call fetchUser and fetchProject on componentDidMount', async () => {
    jest.spyOn(userCreateProjectProps, 'fetchUser');
    jest.spyOn(userCreateProjectProps, 'fetchProject');

    render();

    await Promise.resolve();
    await Promise.resolve();

    expect(userCreateProjectProps.fetchUser).toHaveBeenCalled();
    expect(userCreateProjectProps.fetchProject).toHaveBeenCalled();
  });

  it('should call createUserCMS on submit form', async () => {
    jest.spyOn(userCreateProjectProps, 'createUserProject');

    userCreateProjectProps.fetchUser = jest.fn().mockReturnValue(Promise.resolve());
    userCreateProjectProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());

    const wrapper = render();

    await Promise.resolve();
    await Promise.resolve();

    wrapper
      .dive()
      .find(Formik)
      .prop('onSubmit')({ id: '1' }, { setSubmitting: Function.prototype, setErrors: Function.prototype });

    expect(userCreateProjectProps.createUserProject).toHaveBeenCalledTimes(1);
  });
});
