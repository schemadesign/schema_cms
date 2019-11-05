import React from 'react';
import { shallow } from 'enzyme';

import { CreateFilter } from '../createFilter.component';

describe('CreateFilter: Component', () => {
  const defaultProps = {};

  const component = props => <CreateFilter {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
