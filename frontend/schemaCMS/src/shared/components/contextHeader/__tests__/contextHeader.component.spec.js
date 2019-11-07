import React from 'react';
import { shallow } from 'enzyme';

import { ContextHeader } from '../contextHeader.component';
import { defaultProps } from '../contextHeader/contextHeader.stories';

describe('ContextHeader: Component', () => {
  const component = props => <ContextHeader {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
