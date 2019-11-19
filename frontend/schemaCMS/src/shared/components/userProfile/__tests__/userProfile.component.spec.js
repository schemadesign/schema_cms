import React from 'react';
import { shallow } from 'enzyme';

import { UserProfile } from '../userProfile.component';
import { defaultProps, currentUserProps } from '../userProfile.stories';

describe('UserProfile: Component', () => {
  const component = props => <UserProfile {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly current user', () => {
    const wrapper = render(currentUserProps);
    global.expect(wrapper).toMatchSnapshot();
  });
});
