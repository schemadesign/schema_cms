import React from 'react';
import { shallow } from 'enzyme';

import { User } from '../user.component';

describe('User: Component', () => {
  const defaultProps = {};

  const component = props => <User {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
