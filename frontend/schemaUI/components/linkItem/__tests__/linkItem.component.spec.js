import React from 'react';
import { shallow } from 'enzyme';

import { LinkItem } from '../linkItem.component';
import { defaultProps } from '../linkItem.stories';

describe('LinkItem: Component', () => {
  const component = props => <LinkItem {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
