import React from 'react';
import { shallow } from 'enzyme';

import { ContextHeader } from '../contextHeader.component';

describe('ContextHeader: Component', () => {
  const defaultProps = {};

  const component = props => <ContextHeader {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
