import React from 'react';
import { shallow } from 'enzyme';

import { CreateBlock } from '../createBlock.component';

describe('CreateBlock: Component', () => {
  const defaultProps = {};

  const component = props => <CreateBlock {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
