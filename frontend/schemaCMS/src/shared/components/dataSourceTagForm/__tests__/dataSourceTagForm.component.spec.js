import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceTagForm } from '../dataSourceTagForm.component';

describe('DataSourceTagForm: Component', () => {
  const defaultProps = {};

  const component = props => <DataSourceTagForm {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
