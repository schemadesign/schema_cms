import React from 'react';
import { shallow } from 'enzyme';

import DataSource from '../dataSource.component';

describe('DataSource: Component', () => {
  const defaultProps = {
    match: {
      path: 'path',
    },
  };

  const component = props => <DataSource {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
