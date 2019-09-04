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

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
