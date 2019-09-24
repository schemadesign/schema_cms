import React from 'react';
import { shallow } from 'enzyme';

import { CheckboxOnIconComponent } from '../checkboxOnIcon.component';

describe('CheckboxOnIcon: Component', () => {
  const defaultProps = {};

  const component = props => <CheckboxOnIconComponent {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
