import React from 'react';
import { shallow } from 'enzyme';

import DataSource from '../dataSource.component';
import { defaultProps, propsWithActiveJob } from '../dataSource.stories';

describe('DataSource: Component', () => {
  const component = props => <DataSource {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render without routing', async () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render without rest steps', async () => {
    const fetchDataSource = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render({ fetchDataSource });
    await Promise.resolve();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const fetchDataSource = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render({ ...propsWithActiveJob, fetchDataSource });
    await Promise.resolve();
    expect(wrapper).toMatchSnapshot();
  });
});
