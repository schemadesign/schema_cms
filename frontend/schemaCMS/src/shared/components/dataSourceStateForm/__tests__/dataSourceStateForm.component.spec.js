import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceStateForm } from '../dataSourceStateForm.component';
import { defaultProps } from '../dataSourceStateForm.stories';

describe('DataSourceStateForm: Component', () => {
  const component = props => <DataSourceStateForm {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
