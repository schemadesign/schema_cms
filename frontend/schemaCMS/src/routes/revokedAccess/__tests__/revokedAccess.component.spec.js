import React from 'react';
import { shallow } from 'enzyme';

import { RevokedAccessComponent as RevokedAccess } from '../revokedAccess.component';
import { defaultProps } from '../revokedAccess.stories';

describe('RevokedAccess: Component', () => {
  const component = props => <RevokedAccess {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
