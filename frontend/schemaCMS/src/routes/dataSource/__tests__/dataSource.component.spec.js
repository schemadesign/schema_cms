import React from 'react';
import { shallow } from 'enzyme';

import DataSource from '../dataSource.component';
import { defaultProps } from '../dataSource.stories';

describe('DataSource: Component', () => {
  const component = props => <DataSource {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
