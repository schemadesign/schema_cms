import React from 'react';
import { shallow } from 'enzyme';

import { Select } from '../select.component';

describe('Select: Component', () => {
  const defaultProps = {};

  const component = props => <Select {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
