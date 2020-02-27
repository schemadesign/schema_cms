import React from 'react';
import { shallow } from 'enzyme';

import { Templates } from '../templates.component';
import { defaultProps } from '../templates.stories';

describe('Templates: Component', () => {
  const component = props => <Templates {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', async () => {
    const wrapper = await render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
