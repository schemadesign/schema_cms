import React from 'react';
import { shallow } from 'enzyme';

import { View } from '../view.component';
import { STATUS_DRAFT } from '../../../../../modules/dataSource/dataSource.constants';

describe('View: Component', () => {
  const defaultProps = {
    dataSource: {},
    fetchDataSource: Function.prototype,
    unmountDataSource: Function.prototype,
    removeDataSource: Function.prototype,
    handleChange: Function.prototype,
    handleSubmit: Function.prototype,
    setFieldValue: Function.prototype,
    intl: {
      formatMessage: ({ defaultMessage }) => defaultMessage,
    },
    history: {
      push: Function.prototype,
    },
    values: {},
    match: {
      params: {
        projectId: '1',
        dataSourceId: '1',
        step: '1',
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
      },
    };
    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render second step', () => {
    const props = {
      values: {
        id: 'id',
        name: 'name',
        step: '2',
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
      },
      match: {
        params: {
          projectId: '1',
          dataSourceId: '1',
          step: '0',
        },
      },
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render draft', () => {
    const props = {
      values: {
        id: 'id',
        status: STATUS_DRAFT,
      },
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
