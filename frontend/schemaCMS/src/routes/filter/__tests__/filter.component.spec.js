import React from 'react';
import { shallow } from 'enzyme';

import { Filter } from '../filter.component';

describe('Filter: Component', () => {
  const defaultProps = {};

  const component = props => <Filter {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
