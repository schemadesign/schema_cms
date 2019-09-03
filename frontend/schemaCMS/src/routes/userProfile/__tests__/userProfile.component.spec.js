import React from 'react';
import { shallow } from 'enzyme';

import { UserProfile } from '../userProfile.component';

describe('UserProfile: Component', () => {
  const defaultProps = {};

  const component = props => <UserProfile {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
