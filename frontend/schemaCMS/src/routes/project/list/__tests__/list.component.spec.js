import React from 'react';
import { shallow } from 'enzyme';

import { List } from '../list.component';

describe('List: Component', () => {
  const defaultProps = {};

  const component = props => <List {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
