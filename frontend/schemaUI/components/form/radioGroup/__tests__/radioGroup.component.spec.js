import React from 'react';
import { shallow } from 'enzyme';

import { RadioGroup } from '../radioGroup.component';

describe('RadioGroup: Component', () => {
  const defaultProps = {};

  const component = props => <RadioGroup {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
