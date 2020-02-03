import React from 'react';
import { shallow } from 'enzyme';

import { ProjectStateList } from '../projectStateList.component';

describe('ProjectStateList: Component', () => {
  const defaultProps = {};

  const component = props => <ProjectStateList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
