import React from 'react';
import { shallow } from 'enzyme';

import { DropZone } from '../dropZone.component';

describe('DropZone: Component', () => {
  const defaultProps = {};

  const component = props => <DropZone {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
