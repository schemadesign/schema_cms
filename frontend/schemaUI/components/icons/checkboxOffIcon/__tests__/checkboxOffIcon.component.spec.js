import React from 'react';
import { shallow } from 'enzyme';

import { CheckboxOffIconComponent } from '../checkboxOffIcon.component';

describe('CheckboxOffIcon: Component', () => {
  const defaultProps = {};

  const component = props => <CheckboxOffIconComponent {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
