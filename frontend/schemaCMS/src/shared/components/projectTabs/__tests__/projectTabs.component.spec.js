import React from 'react';
import { shallow } from 'enzyme';

import { ProjectTabs } from '../projectTabs.component';

describe('ProjectTabs: Component', () => {
  const defaultProps = {};

  const component = props => <ProjectTabs {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
