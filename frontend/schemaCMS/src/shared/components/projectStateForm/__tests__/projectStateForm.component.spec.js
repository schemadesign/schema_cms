import React from 'react';
import { shallow } from 'enzyme';

import { ProjectStateForm } from '../projectStateForm.component';

describe('ProjectStateForm: Component', () => {
  const defaultProps = {};

  const component = props => <ProjectStateForm {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
