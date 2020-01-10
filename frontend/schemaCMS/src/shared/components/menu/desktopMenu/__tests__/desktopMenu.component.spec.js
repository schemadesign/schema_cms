import React from 'react';
import { shallow } from 'enzyme';

import { DesktopMenuComponent as DesktopMenu } from '../desktopMenu.component';

describe('DesktopMenu: Component', () => {
  const defaultProps = {};

  const component = props => <DesktopMenu {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
