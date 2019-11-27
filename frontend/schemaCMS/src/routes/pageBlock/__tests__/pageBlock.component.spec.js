import React from 'react';
import { shallow } from 'enzyme';

import { PageBlock } from '../pageBlock.component';

describe('PageBlock: Component', () => {
  const defaultProps = {};

  const component = props => <PageBlock {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
