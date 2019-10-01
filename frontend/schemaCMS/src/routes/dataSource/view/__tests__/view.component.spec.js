import React from 'react';
import { shallow } from 'enzyme';

import { View } from '../view.component';
import { defaultProps } from '../view.stories';
import { STATUS_DRAFT } from '../../../../modules/dataSource/dataSource.constants';

describe('View: Component', () => {
  const component = props => <View {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should not render content', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render source step', () => {
    const props = {
      dataSource: {
        id: 'id',
        name: 'name',
        project: '1',
      },
    };
    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render second step', () => {
    const props = {
      dataSource: {
        id: 'id',
        name: 'name',
        step: '2',
        project: '1',
      },
    };
    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should not render any step', () => {
    const props = {
      dataSource: {
        id: 'id',
        name: 'name',
        project: '1',
      },
      match: {
        params: {
          projectId: '1',
          dataSourceId: '1',
          step: '0',
        },
        url: '/project/view/1/datasource/view/1/0',
      },
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render draft', () => {
    const props = {
      dataSource: {
        id: 'id',
        status: STATUS_DRAFT,
        project: '1',
      },
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
