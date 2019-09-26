import React from 'react';
import { mount } from 'enzyme';

import { Label } from '../label.component';

describe('Label: Component', () => {
  const defaultProps = {};

  const component = props => <Label {...defaultProps} {...props} />;

  const render = (props = {}) => mount(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const customStyles = { color: 'blue' };
    const wrapper = render({ customStyles });
    global.expect(wrapper).toMatchSnapshot();
  });
});
