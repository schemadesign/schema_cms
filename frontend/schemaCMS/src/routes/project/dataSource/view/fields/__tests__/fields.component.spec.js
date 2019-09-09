import React from 'react';
import { shallow } from 'enzyme';

import { Fields } from '../fields.component';

describe('Fields: Component', () => {
  const defaultProps = {};

  const component = props => <Fields {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
