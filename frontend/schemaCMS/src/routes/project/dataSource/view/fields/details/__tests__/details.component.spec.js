import React from 'react';
import { shallow } from 'enzyme';

import { Details } from '../details.component';

describe('Details: Component', () => {
  const defaultProps = {};

  const component = props => <Details {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
