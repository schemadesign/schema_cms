import React from 'react';
import { shallow } from 'enzyme';

import { ProjectState } from '../projectState.component';

describe('ProjectState: Component', () => {
  const defaultProps = {};

  const component = props => <ProjectState {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
