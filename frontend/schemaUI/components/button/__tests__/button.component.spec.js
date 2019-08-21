import React from 'react';
import { shallow } from 'enzyme';

import { Button } from '../button.component';

describe('Button: Component', () => {
  const defaultProps = {};

  const component = props => (
    <Button {...defaultProps} {...props}>
      button
    </Button>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom styles', () => {
    const props = {
      customStyles: {
        backgroundColor: 'red',
      },
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
