import React from 'react';
import { shallow } from 'enzyme';

import { Checkbox } from '../checkbox.component';

describe('Checkbox: Component', () => {
  const defaultProps = {};

  const component = props => <Checkbox {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
