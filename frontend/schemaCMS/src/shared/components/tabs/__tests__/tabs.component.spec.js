import React from 'react';
import { shallow } from 'enzyme';

import { Tabs } from '../tabs.component';
import { defaultProps } from '../tabs.stories';

describe('Tabs: Component', () => {
  const component = props => <Tabs {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
