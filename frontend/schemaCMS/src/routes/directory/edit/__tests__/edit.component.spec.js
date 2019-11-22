import React from 'react';
import { shallow } from 'enzyme';

import { Edit } from '../edit.component';

describe('Edit: Component', () => {
  const defaultProps = {};

  const component = props => <Edit {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
