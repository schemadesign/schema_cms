import React from 'react';
import { shallow } from 'enzyme';

import { AuthRoute } from '../authRoute.component';

describe('AuthRoute: Component', () => {
  const defaultProps = {};

  const component = props => <AuthRoute {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
