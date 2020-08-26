import React from 'react';
import { act } from 'react-test-renderer';

import { DataSourceList } from '../dataSourceList.component';
import { DataSourceCard } from '../dataSourceCard.component';
import { defaultProps, propsWithDataSources } from '../dataSourceList.stories';
import { ListItemTitle } from '../../../../shared/components/listComponents';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';
import { dataSources } from '../../../../modules/dataSource/dataSource.mock';

const mockPushHistory = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockPushHistory,
  }),
  useParams: () => ({
    projectId: 'projectId',
  }),
}));

describe('DataSourceList: Component', () => {
  const cardProps = {
    uploadingDataSources: [],
    copyDataSource: Function.prototype,
    index: 0,
    key: 0,
    projectId: 'projectId',
  };
  const render = props => makeContextRenderer(<DataSourceList {...defaultProps} {...props} />);
  const renderCard = dataSource => makeContextRenderer(<DataSourceCard {...cardProps} {...dataSource} />);

  it('should render empty', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    const wrapper = await render(propsWithDataSources);
    expect(wrapper).toMatchSnapshot();
  });

  it('should go to source', async () => {
    const wrapper = await renderCard(dataSources[0]);

    wrapper.root.findByType(ListItemTitle).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/datasource/17/source');
  });

  it('should go to preview', async () => {
    const wrapper = await renderCard(dataSources[2]);

    wrapper.root.findByType(ListItemTitle).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/datasource/17/preview');
  });

  it('should go to data result', async () => {
    const wrapper = await renderCard(dataSources[3]);

    wrapper.root.findByType(ListItemTitle).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/datasource/17/result');
  });

  it('should go to create data source page', async () => {
    const wrapper = await render(propsWithDataSources);

    wrapper.root.findByProps({ id: 'createDataSourceDesktopBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/datasource/add');
  });

  it('should go to create data source page on mobile', async () => {
    const wrapper = await render(propsWithDataSources);

    wrapper.root.findByProps({ id: 'createDataSourceBtn' }).props.onClick();

    expect(mockPushHistory).toHaveBeenCalledWith('/project/projectId/datasource/add');
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

  it('should render error correctly', async () => {
    const errorResponse = 'fetchDataSources should return error';
    const wrapper = await render({
      fetchDataSources: jest.fn().mockReturnValue(Promise.reject(errorResponse)),
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should call copyDataSources', async () => {
    jest.spyOn(propsWithDataSources, 'copyDataSource');
    const wrapper = await render(propsWithDataSources);
    const projectId = 'projectId';

    await act(async () => {
      await wrapper.root.findByProps({ id: 'dataSourceCopyButton-0' }).props.onClick();
    });

    expect(propsWithDataSources.copyDataSource).toHaveBeenCalledWith({ dataSourceId: 17, projectId });
  });
});
