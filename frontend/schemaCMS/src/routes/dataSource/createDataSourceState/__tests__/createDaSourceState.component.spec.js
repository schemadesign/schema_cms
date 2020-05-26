import React from 'react';
import { shallow } from 'enzyme';

import { CreateDataSourceState } from '../createDataSourceState.component';
import { defaultProps } from '../createDataSourceState.stories';

describe('CreateDataSourceState: Component', () => {
  const component = props => <CreateDataSourceState {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
