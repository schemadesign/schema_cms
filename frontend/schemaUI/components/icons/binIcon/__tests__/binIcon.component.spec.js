import React from 'react';
import { shallow } from 'enzyme';

import { BinIconComponent } from '../binIcon.component';

describe('BinIcon: Component', () => {
  const defaultProps = {};

  const component = props => <BinIconComponent {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
