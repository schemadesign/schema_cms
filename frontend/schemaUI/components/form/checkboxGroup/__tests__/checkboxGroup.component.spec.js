import React from 'react';
import { shallow } from 'enzyme';

import { CheckboxGroup } from '../checkboxGroup.component';
import { children, defaultProps } from '../checkboxGroup.stories';

describe('CheckboxGroup: Component', () => {
  const component = props => (
    <CheckboxGroup {...defaultProps} {...props}>
      {children}
    </CheckboxGroup>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
