import React from 'react';
import { shallow } from 'enzyme';

import { DataGrid } from '../dataGrid.component';

describe('DataGrid: Component', () => {
  const defaultProps = {};

  const component = props => <DataGrid {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
