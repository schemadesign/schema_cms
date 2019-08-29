import React from 'react';
import { shallow } from 'enzyme';

import { Create } from '../create.component';

describe('Create: Component', () => {
  const defaultProps = {};

  const component = props => <Create {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
