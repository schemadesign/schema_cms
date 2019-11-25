import React from 'react';
import { shallow } from 'enzyme';

import { BlockList } from '../blockList.component';

describe('BlockList: Component', () => {
  const defaultProps = {};

  const component = props => <BlockList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
