import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceTag } from '../dataSourceTag.component';

describe('DataSourceTag: Component', () => {
  const defaultProps = {};

  const component = props => <DataSourceTag {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
