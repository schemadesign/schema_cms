import React from 'react';
import { shallow } from 'enzyme';

import { UserCreate } from '../userCreate.component';
import { defaultProps } from '../userCreate.stories';

describe('UserCreate: Component', () => {
  const component = props => <UserCreate {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
