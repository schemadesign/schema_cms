import React from 'react';
import { shallow } from 'enzyme';

import { User } from '../user.component';

const defaultProps = {
  createUserProject: Function.prototype,
  createUserCMS: Function.prototype,
  isAdmin: true,
  history: {
    push: Function.prototype,
  },
  match: {
    path: '/user',
  },
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
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

  it('should redirect to not-authorized page not admin user', () => {
    jest.spyOn(defaultProps.history, 'push');
    render({ isAdmin: false });
    expect(defaultProps.history.push).toHaveBeenCalledWith('/not-authorized');
  });
});
