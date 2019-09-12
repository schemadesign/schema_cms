import React from 'react';
import { shallow } from 'enzyme';

import { CheckboxGroup } from '../checkboxGroup.component';

describe('CheckboxGroup: Component', () => {
  const defaultProps = {};

  const component = props => <CheckboxGroup {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
