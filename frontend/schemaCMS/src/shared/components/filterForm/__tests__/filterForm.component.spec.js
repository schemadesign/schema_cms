import React from 'react';
import { shallow } from 'enzyme';

import { FilterForm } from '../filterForm.component';

describe('FilterForm: Component', () => {
  const defaultProps = {};

  const component = props => <FilterForm {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
