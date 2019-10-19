import React from 'react';
import { shallow } from 'enzyme';

import { AddUser } from '../addUser.component';
import { defaultProps, propsWithUsers } from '../addUser.stories';

describe('AddUser: Component', () => {
  const component = props => <AddUser {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with users', () => {
    const wrapper = render(propsWithUsers);
    global.expect(wrapper).toMatchSnapshot();
  });
});
