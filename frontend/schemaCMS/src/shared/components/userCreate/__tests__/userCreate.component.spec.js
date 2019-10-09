import React from 'react';
import { shallow } from 'enzyme';

import { UserCreate, UserCreateCMS, UserCreateProject } from '../userCreate.component';

describe('UserCreate: Component', () => {
  const defaultProps = {
    handleSubmit: Function.prototype,
  };

  const component = props => <UserCreate {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});

describe('UserCreateCMS: Component', () => {
  const defaultProps = {
    createUserCMS: Function.prototype,
  };

  const component = props => <UserCreateCMS {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});

describe('UserCreateProject: Component', () => {
  const defaultProps = {
    createUserProject: Function.prototype,
  };

  const component = props => <UserCreateProject {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
