import React from 'react';
import { shallow } from 'enzyme';

import { User } from '../user.component';

const defaultProps = {
  createUserProject: Function.prototype,
  createUserCMS: Function.prototype,
  match: {
    path: '/user',
  },
};

const propsWithId = {
  match: {
    path: '/user/1/add',
  },
};

describe('User: Component', () => {
  const component = props => <User {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with project id', () => {
    const wrapper = render(propsWithId);
    global.expect(wrapper).toMatchSnapshot();
  });
});
