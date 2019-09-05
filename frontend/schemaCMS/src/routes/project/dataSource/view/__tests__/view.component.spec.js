import React from 'react';
import { shallow } from 'enzyme';

import { View } from '../view.component';

describe('View: Component', () => {
  const defaultProps = {
    dataSource: {},
    fetchDataSource: Function.prototype,
    unmountDataSource: Function.prototype,
    handleChange: Function.prototype,
    handleSubmit: Function.prototype,
    setFieldValue: Function.prototype,
    intl: {
      formatMessage: Function.prototype,
    },
    values: {},
    match: {
      params: {
        projectId: '1',
        dataSourceId: '1',
      },
    },
  };

  const component = props => <View {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should not render content', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render source step', () => {
    const props = {
      values: {
        id: 'id',
        name: 'name',
        step: '1',
      },
    };
    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should not render any step', () => {
    const props = {
      values: {
        id: 'id',
        name: 'name',
        step: '0',
      },
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render draft', () => {
    const props = {
      values: {
        id: 'id',
        status: 'draft',
      },
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
