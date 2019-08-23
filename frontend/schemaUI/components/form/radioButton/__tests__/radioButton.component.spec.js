import React from 'react';
import { shallow } from 'enzyme';

import { RadioButton } from '../radioButton.component';

describe('RadioButton: Component', () => {
  const defaultProps = {};

  const component = props => <RadioButton {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
