import React from 'react';
import { shallow } from 'enzyme';

import { CardHeader } from '../cardHeader.component';
import { defaultProps } from '../cardHeader.stories';

describe('CardHeader: Component', () => {
  const component = props => <CardHeader {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
