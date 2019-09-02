import React from 'react';
import { shallow } from 'enzyme';

import { Grid } from '../grid.component';

describe('Grid: Component', () => {
  const defaultProps = {};

  const component = props => <Grid {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
