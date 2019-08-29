import React from 'react';
import { shallow } from 'enzyme';

import { Project } from '../project.component';

describe('Project: Component', () => {
  const defaultProps = {
    match: {
      path: '/projects',
    },
  };

  const component = props => <Project {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
