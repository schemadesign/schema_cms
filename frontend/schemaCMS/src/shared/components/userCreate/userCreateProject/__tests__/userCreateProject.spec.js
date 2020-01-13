import React from 'react';
import { shallow } from 'enzyme';
import { Formik } from 'formik';

import { UserCreateProject } from '../userCreateProject.component';
import { userCreateProjectProps } from '../userCreateProject.stories';
import { UserCreate } from '../../userCreateComponent/userCreate.component';
import browserHistory from '../../../../utils/history';

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

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchUser and fetchProject on componentDidMount', async () => {
    jest.spyOn(userCreateProjectProps, 'fetchUser');
    jest.spyOn(userCreateProjectProps, 'fetchProject');

    const wrapper = render();

    expect(wrapper).toMatchSnapshot();
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

  it('should redirect on cancel', async () => {
    jest.spyOn(browserHistory, 'push');

    userCreateProjectProps.fetchUser = jest.fn().mockReturnValue(Promise.resolve());
    userCreateProjectProps.fetchProject = jest.fn().mockReturnValue(Promise.resolve());

    const wrapper = render();

    await Promise.resolve();
    await Promise.resolve();

    wrapper
      .dive()
      .dive()
      .find(UserCreate)
      .prop('onCancelClick')({ preventDefault: Function.prototype });

    expect(browserHistory.push).toHaveBeenCalledWith('/project/1/user/add');
  });
});
