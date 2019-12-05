import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceViews } from '../dataSourceViews.component';
import { defaultProps } from '../dataSourceViews.stories';

describe('DataSourceViews: Component', () => {
  const component = props => <DataSourceViews {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
