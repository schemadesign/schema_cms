import React from 'react';
import { shallow } from 'enzyme';

import { defaultProps, TestComponent, withLabel } from '../switch.stories';

describe('Switch: Component', () => {
  const component = props => <TestComponent {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with label', () => {
    const wrapper = render(withLabel);
    global.expect(wrapper).toMatchSnapshot();
  });
});
