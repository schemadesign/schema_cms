import React from 'react';
import { shallow } from 'enzyme';

import { TextInputComponent as TextInput } from '../textInput.component';

describe('TextInput: Component', () => {
  const defaultProps = {};

  const component = props => <TextInput {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
