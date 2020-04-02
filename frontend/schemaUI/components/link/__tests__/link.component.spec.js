import React from 'react';
import { shallow } from 'enzyme';

import { Link } from '../link.component';
import { defaultProps } from '../link.stories';

describe('Link: Component', () => {
  const component = props => <Link {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
