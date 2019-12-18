import React from 'react';
import { shallow } from 'enzyme';

import { NotRegisteredComponent as NotRegistered } from '../notRegistered.component';
import { defaultProps } from '../notRegistered.stories';

describe('NotRegistered: Component', () => {
  const component = props => <NotRegistered {...defaultProps} {...props} />;

  it('should render correctly', () => {
    const wrapper = shallow(component());
    global.expect(wrapper).toMatchSnapshot();
  });
});
