import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceList } from '../dataSourceList.component';
import { defaultProps, propsWithDataSources } from '../dataSourceList.stories';

describe('DataSourceList: Component', () => {
  const component = props => <DataSourceList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render empty', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const wrapper = await render(propsWithDataSources);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call fetchDataSources on componentDidMount', async () => {
    jest.spyOn(defaultProps, 'fetchDataSources');

    await render();

    expect(defaultProps.fetchDataSources).toHaveBeenCalled();
  });

  it('should call cancelFetchListLoop on componentWillUnmount', async () => {
    jest.spyOn(defaultProps, 'cancelFetchListLoop');

    const wrapper = await render();

    wrapper.unmount();

    expect(defaultProps.cancelFetchListLoop).toHaveBeenCalled();
  });

  it('should set error correctly', async () => {
    const errorResponse = 'fetchDataSources should return error';
    const wrapper = await render({
      fetchDataSources: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    const { loading, error } = wrapper.state();

    expect(loading).toBeFalsy();
    expect(error).toBe(errorResponse);
  });
});
