import React from 'react';
import { shallow } from 'enzyme';

import { Select } from '../select.component';
import { defaultProps } from '../select.stories';

describe('Select: Component', () => {
  const component = props => <Select {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render({
      value: 'one',
    });
    global.expect(wrapper).toMatchSnapshot();
  });
});
