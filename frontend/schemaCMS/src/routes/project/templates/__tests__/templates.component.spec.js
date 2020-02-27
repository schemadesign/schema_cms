import React from 'react';
import { shallow } from 'enzyme';

import { Templates } from '../templates.component';

describe('Templates: Component', () => {
  const defaultProps = {};

  const component = props => <Templates {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
