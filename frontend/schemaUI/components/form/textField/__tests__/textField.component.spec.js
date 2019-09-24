import React from 'react';
import { mount } from 'enzyme';

import { TextField } from '../textField.component';

describe('TextField: Component', () => {
  const defaultProps = {
    name: 'name',
  };

  const component = props => <TextField {...defaultProps} {...props} />;

  const render = (props = {}) => mount(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
