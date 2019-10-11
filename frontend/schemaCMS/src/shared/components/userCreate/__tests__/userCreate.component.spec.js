import React from 'react';
import { shallow } from 'enzyme';

import { UserCreate, UserCreateCMS, UserCreateProject } from '../userCreate.component';
import { defaultProps, userCreateCMSProps, userCreateProjectProps } from '../userCreate.stories';

describe('UserCreate: Component', () => {
  const component = props => <UserCreate {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});

describe('UserCreateCMS: Component', () => {
  const component = props => <UserCreateCMS {...userCreateCMSProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});

describe('UserCreateProject: Component', () => {
  const component = props => <UserCreateProject {...userCreateProjectProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
