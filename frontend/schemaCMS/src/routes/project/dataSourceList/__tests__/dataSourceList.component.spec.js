import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceList } from '../dataSourceList.component';
import { defaultProps, propsWithDataSources } from '../dataSourceList.stories';
import { PlusButton } from '../../../../shared/components/navigation';
import { ListItemTitle } from '../../../../shared/components/listComponents';

describe('DataSourceList: Component', () => {
  const component = props => <DataSourceList {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render empty', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', () => {
    const wrapper = render(propsWithDataSources);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should go to source', () => {
    jest.spyOn(propsWithDataSources.history, 'push');
    const wrapper = render(propsWithDataSources);

    wrapper
      .find(ListItemTitle)
      .at(0)
      .simulate('click');

    expect(propsWithDataSources.history.push).toHaveBeenCalledWith('/datasource/17/source');
  });

  it('should go to preview', () => {
    jest.spyOn(propsWithDataSources.history, 'push');
    const wrapper = render(propsWithDataSources);

    wrapper
      .find(ListItemTitle)
      .at(1)
      .simulate('click');

    expect(propsWithDataSources.history.push).toHaveBeenCalledWith('/datasource/17/preview');
  });

  it('should go to data result', () => {
    jest.spyOn(propsWithDataSources.history, 'push');
    const wrapper = render(propsWithDataSources);

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
});
