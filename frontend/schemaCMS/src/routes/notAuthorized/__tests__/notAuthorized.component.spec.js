import React from 'react';
import { shallow } from 'enzyme';

import { NotAuthorized } from '../notAuthorized.component';

describe('NotAuthorized: Component', () => {
  const defaultProps = {};

  const component = props => <NotAuthorized {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
