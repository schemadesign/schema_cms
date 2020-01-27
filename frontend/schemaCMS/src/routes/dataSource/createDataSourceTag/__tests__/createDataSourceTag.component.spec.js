import React from 'react';
import { shallow } from 'enzyme';

import { CreateDataSourceTag } from '../createDataSourceTag.component';
import { defaultProps } from '../createDataSourceTag.stories';

describe('CreateDataSourceTag: Component', () => {
  const component = props => <CreateDataSourceTag {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
