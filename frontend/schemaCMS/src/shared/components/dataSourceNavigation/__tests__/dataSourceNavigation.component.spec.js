import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceNavigation } from '../dataSourceNavigation.component';
import { defaultProps, propsWithFakeJob, propsWithJob } from '../dataSourceNavigation.stories';

describe('DataSourceNavigation: Component', () => {
  const component = props => <DataSourceNavigation {...defaultProps} {...props} />;
  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with fake job', () => {
    const wrapper = render(propsWithFakeJob);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with job', () => {
    const wrapper = render(propsWithJob);
    expect(wrapper).toMatchSnapshot();
  });
});
