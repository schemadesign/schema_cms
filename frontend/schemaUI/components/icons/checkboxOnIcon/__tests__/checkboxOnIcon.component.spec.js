import React from 'react';
import { shallow } from 'enzyme';

import { CheckboxOnIcon } from '../checkboxOnIcon.component';

describe('CheckboxOnIcon: Component', () => {
  const defaultProps = {};

  const component = props => <CheckboxOnIcon {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
