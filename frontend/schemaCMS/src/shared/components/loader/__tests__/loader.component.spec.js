import React from 'react';
import { shallow } from 'enzyme';

import { Loader } from '../loader.component';

describe('Loader: Component', () => {
  const defaultProps = {};

  const component = props => <Loader {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
