import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceNavigation } from '../dataSourceNavigation.component';

describe('DataSourceNavigation: Component', () => {
  const defaultProps = {};

  const component = props => <DataSourceNavigation {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
