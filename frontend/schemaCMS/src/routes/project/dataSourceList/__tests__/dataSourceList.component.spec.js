import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceList } from '../dataSourceList.component';
import { defaultProps, propsWithDataSources } from '../dataSourceList.stories';
import { PlusButton } from '../../../../shared/components/navigation';
import { ListItemTitle } from '../../../../shared/components/listComponents';

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

  it('should go to source', async () => {
    jest.spyOn(propsWithDataSources.history, 'push');
    const wrapper = await render(propsWithDataSources);

    wrapper
      .find(ListItemTitle)
      .at(0)
      .simulate('click');

    expect(propsWithDataSources.history.push).toHaveBeenCalledWith('/datasource/17/source');
  });

  it('should go to preview', async () => {
    jest.spyOn(propsWithDataSources.history, 'push');
    const wrapper = await render(propsWithDataSources);

    wrapper
      .find(ListItemTitle)
      .at(1)
      .simulate('click');

    expect(propsWithDataSources.history.push).toHaveBeenCalledWith('/datasource/17/preview');
  });

  it('should go to data result', async () => {
    jest.spyOn(propsWithDataSources.history, 'push');
    const wrapper = await render(propsWithDataSources);

    wrapper
      .find(ListItemTitle)
      .at(2)
      .simulate('click');

    expect(propsWithDataSources.history.push).toHaveBeenCalledWith('/datasource/17/result');
  });

  it('should go to create data source page', () => {
    jest.spyOn(propsWithDataSources.history, 'push');
    const wrapper = render(propsWithDataSources);

    wrapper
      .find(PlusButton)
      .at(0)
      .simulate('click');

    expect(propsWithDataSources.history.push).toHaveBeenCalledWith('/project/1/datasource/add');
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
