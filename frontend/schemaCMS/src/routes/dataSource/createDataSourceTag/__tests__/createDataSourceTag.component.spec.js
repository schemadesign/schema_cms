import React from 'react';
import { shallow } from 'enzyme';

import { CreateDataSourceTag } from '../createDataSourceTag.component';

describe('CreateDataSourceTag: Component', () => {
  const defaultProps = {};

  const component = props => <CreateDataSourceTag {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
