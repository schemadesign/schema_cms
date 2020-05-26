import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceState } from '../dataSourceState.component';
import { defaultProps } from '../dataSourceState.stories';

describe('DataSourceState: Component', () => {
  const component = props => <DataSourceState {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
