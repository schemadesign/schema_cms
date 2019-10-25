import React from 'react';
import { shallow } from 'enzyme';

import { UserCreateProject } from '../userCreateProject';
import { userCreateProjectProps } from '../userCreateProject.stories';

describe('UserCreateProject: Component', () => {
  const component = props => <UserCreateProject {...userCreateProjectProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
