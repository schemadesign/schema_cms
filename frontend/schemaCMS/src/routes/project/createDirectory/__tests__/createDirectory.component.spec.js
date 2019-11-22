import React from 'react';
import { shallow } from 'enzyme';

import { CreateDirectory } from '../createDirectory.component';
import { defaultProps } from '../createDirectory.stories';

describe('CreateDirectory: Component', () => {
  const component = props => <CreateDirectory {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
