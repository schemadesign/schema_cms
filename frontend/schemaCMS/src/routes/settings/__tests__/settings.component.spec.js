import React from 'react';
import { shallow } from 'enzyme';

import { Settings } from '../settings.component';
import { defaultProps } from '../settings.stories';

describe('Settings: Component', () => {
  const component = props => <Settings {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
