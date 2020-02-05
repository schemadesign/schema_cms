import React from 'react';
import { shallow } from 'enzyme';

import { CreateProjectState } from '../createProjectState.component';
import { defaultProps } from '../createProjectState.stories';

describe('CreateProjectState: Component', () => {
  const component = props => <CreateProjectState {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
