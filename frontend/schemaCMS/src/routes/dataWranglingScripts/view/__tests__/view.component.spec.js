import React from 'react';
import { shallow } from 'enzyme';

import { View } from '../view.component';
import { defaultProps } from '../view.stories';

describe('View: Component', () => {
  const component = props => <View {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
