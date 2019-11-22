import React from 'react';
import { shallow } from 'enzyme';

import { Directory } from '../directory.component';
import { defaultProps } from '../directory.stories';

describe('Directory: Component', () => {
  const component = props => <Directory {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
