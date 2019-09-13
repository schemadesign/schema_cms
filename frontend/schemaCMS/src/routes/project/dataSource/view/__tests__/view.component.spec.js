import React from 'react';
import { shallow } from 'enzyme';

import { View } from '../view.component';
import { defaultProps } from '../view.stories';
import { STATUS_DRAFT } from '../../../../../modules/dataSource/dataSource.constants';

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
      dataSource: {
        id: 'id',
        status: STATUS_DRAFT,
      },
    };

    const wrapper = render(props);
    global.expect(wrapper).toMatchSnapshot();
  });
});
