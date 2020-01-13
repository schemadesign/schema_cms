import React from 'react';
import { shallow } from 'enzyme';

import { DesktopTopHeader } from '../desktopTopHeader.component';
import { defaultProps } from '../desktopTopHeader.stories';

describe('DesktopTopHeader: Component', () => {
  const component = props => <DesktopTopHeader {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when no user', () => {
    const wrapper = render({ userId: null });
    expect(wrapper).toMatchSnapshot();
  });
});
