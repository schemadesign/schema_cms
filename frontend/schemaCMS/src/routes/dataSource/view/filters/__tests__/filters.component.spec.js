import React from 'react';
import { shallow } from 'enzyme';

import { Filters } from '../filters.component';

describe('Filters: Component', () => {
  const defaultProps = {};

  const component = props => <Filters {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
