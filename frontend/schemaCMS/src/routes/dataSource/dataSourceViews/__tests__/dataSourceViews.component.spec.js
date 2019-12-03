import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceViews } from '../dataSourceViews.component';

describe('DataSourceViews: Component', () => {
  const defaultProps = {};

  const component = props => <DataSourceViews {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
