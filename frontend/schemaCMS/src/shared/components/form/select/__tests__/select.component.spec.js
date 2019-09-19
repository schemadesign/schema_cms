import React from 'react';
import { shallow } from 'enzyme';

import { Select } from '../select.component';
import { defaultProps } from '../select.stories';

describe('Select: Component', () => {
  const component = props => <Select {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const options = [
      { value: 'one', label: 'One', selected: true },
      { value: 'two', label: 'Two', selected: false },
      { value: 'three', label: 'Three', selected: false },
    ];
    const wrapper = render({
      options,
      onSelect: Function.prototype,
    });
    global.expect(wrapper).toMatchSnapshot();
  });
});
