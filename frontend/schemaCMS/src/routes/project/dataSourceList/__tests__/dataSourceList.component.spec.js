import React from 'react';
import { shallow } from 'enzyme';

import { DataSourceList } from '../dataSourceList.component';
import {
  defaultProps,
  propsWithDraft,
  propsWithReadyForProcessing,
  propsWithProcessing,
  propsWithError,
  propsWithDataSource,
  propsWithJob,
} from '../dataSourceList.stories';

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

  it('should render card with error state', () => {
    const wrapper = render(propsWithError);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render card with draft state', () => {
    const wrapper = render(propsWithDraft);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render card with processing state', () => {
    const wrapper = render(propsWithProcessing);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render card with ready for processing state', () => {
    const wrapper = render(propsWithReadyForProcessing);
    global.expect(wrapper).toMatchSnapshot();
  });
});
