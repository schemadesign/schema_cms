import React from 'react';
import { shallow } from 'enzyme';

import { CreateTagCategory } from '../createTagCategory.component';
import { defaultProps } from '../createTagCategory.stories';

describe('CreateTagCategory: Component', () => {
  const component = props => <CreateTagCategory {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
