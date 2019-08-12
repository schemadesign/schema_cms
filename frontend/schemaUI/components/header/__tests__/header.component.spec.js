import React from 'react';
import { shallow } from 'enzyme';

import { Header } from '../header.component';

describe('Header: Component', () => {
  const defaultProps = {};

  const component = props => <Header {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
