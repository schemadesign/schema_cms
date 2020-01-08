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
    const wrapper = await render({ fetchDataSource });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const fetchDataSource = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = await render({ ...propsWithActiveJob, fetchDataSource });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchDataSource on componentDidMount', () => {
    const fetchDataSource = jest.spyOn(defaultProps, 'fetchDataSource');

    render({
      fetchDataSource,
    });

    global.expect(fetchDataSource).toHaveBeenCalledTimes(1);
  });
});
