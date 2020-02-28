import React from 'react';
import { shallow } from 'enzyme';

import { CounterHeader } from '../counterHeader.component';
import { defaultProps } from '../counterHeader.stories';

describe('CounterHeader: Component', () => {
  const component = props => <CounterHeader {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
