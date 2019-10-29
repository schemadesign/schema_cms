import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceList } from '../dataSourceList.component';
import { defaultProps, propsWithDataSource, propsWithJob } from '../dataSourceList.stories';

describe('DataSourceList: Component', () => {
  const component = props => <DataSourceList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render empty', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', () => {
    const wrapper = render(propsWithDataSource);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render card with job', () => {
    const wrapper = render(propsWithJob);
    global.expect(wrapper).toMatchSnapshot();
  });
});
