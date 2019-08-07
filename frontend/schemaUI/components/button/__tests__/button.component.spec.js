import React from 'react';
import { shallow } from 'enzyme';

import { Button } from '../button.component';

describe('Button: Component', () => {
  const defaultProps = {};

  const component = props => <Button {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
