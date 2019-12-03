import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceList } from '../dataSourceList.component';
import { defaultProps, propsWithDataSource } from '../dataSourceList.stories';
import { ListItemTitle } from '../../../../shared/components/listComponents/listItem.styles';
import { PlusButton } from '../../../../shared/components/navigation';

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

  it('should go to data source', () => {
    jest.spyOn(propsWithDataSource.history, 'push');
    const wrapper = render(propsWithDataSource);

    wrapper
      .find(ListItemTitle)
      .at(0)
      .simulate('click');

    expect(propsWithDataSource.history.push).toHaveBeenCalledWith('/datasource/17/preview');
  });

  it('should go to create data source page', () => {
    jest.spyOn(propsWithDataSource.history, 'push');
    const wrapper = render(propsWithDataSource);

    wrapper
      .find(PlusButton)
      .at(0)
      .simulate('click');

    expect(propsWithDataSource.history.push).toHaveBeenCalledWith('/project/1/datasource/add');
  });
});