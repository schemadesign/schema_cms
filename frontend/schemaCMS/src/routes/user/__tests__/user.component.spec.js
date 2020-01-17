import React from 'react';
import { shallow } from 'enzyme';

import { User } from '../user.component';
import { history, intl } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

const defaultProps = {
  userRole: ROLES.ADMIN,
  createUserProject: Function.prototype,
  createUserCMS: Function.prototype,
  isAdmin: true,
  history,
  intl,
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
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with project id', () => {
    const wrapper = render(propsWithId);
    expect(wrapper).toMatchSnapshot();
  });

  it('should redirect to not-authorized page not admin user', () => {
    jest.spyOn(defaultProps.history, 'push');
    render({ isAdmin: false });
    expect(defaultProps.history.push).toHaveBeenCalledWith('/not-authorized');
  });
});
