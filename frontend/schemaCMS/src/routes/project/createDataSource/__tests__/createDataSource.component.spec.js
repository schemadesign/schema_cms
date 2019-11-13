import React from 'react';
import { shallow } from 'enzyme';

import { CreateDataSource } from '../createDataSource.component';

describe('CreateDataSource: Component', () => {
  const defaultProps = {};

  const component = props => <CreateDataSource {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
