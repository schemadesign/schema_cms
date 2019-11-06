import React from 'react';
import { shallow } from 'enzyme';

import { DesktopTopHeader } from '../desktopTopHeader.component';

describe('DesktopTopHeader: Component', () => {
  const defaultProps = {};

  const component = props => <DesktopTopHeader {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
