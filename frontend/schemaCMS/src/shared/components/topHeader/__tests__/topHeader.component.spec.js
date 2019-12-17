import React from 'react';
import { shallow } from 'enzyme';

import { TopHeader } from '../topHeader.component';
import { defaultProps, customMenuProps } from '../topHeader.stories';

describe('TopHeader: Component', () => {
  const component = props => <TopHeader {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with project id', () => {
    const wrapper = render({ projectId: 'projectId' });
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with custom menu', () => {
    const wrapper = render(customMenuProps);
    global.expect(wrapper).toMatchSnapshot();
  });
});
