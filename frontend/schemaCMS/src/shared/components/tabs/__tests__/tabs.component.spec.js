import React from 'react';
import { shallow } from 'enzyme';

import { Tabs } from '../tabs.component';

describe('Tabs: Component', () => {
  const defaultProps = {};

  const component = props => <Tabs {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
