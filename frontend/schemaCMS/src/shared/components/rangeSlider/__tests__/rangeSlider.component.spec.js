import React from 'react';
import { shallow } from 'enzyme';

import { RangeSlider } from '../rangeSlider.component';
import { defaultProps } from '../rangeSlider.stories';

describe('RangeSlider: Component', () => {
  const component = props => <RangeSlider {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
