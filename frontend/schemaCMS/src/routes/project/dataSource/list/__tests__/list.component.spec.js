import React from 'react';
import { shallow } from 'enzyme';

import { List } from '../list.component';

describe('List: Component', () => {
  const defaultProps = {
    createDataSource: Function.prototype,
    match: {
      params: {
        projectId: '1',
      },
    },
    intl: {
      formatMessage: Function.prototype,
    },
  };

  const component = props => <List {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
