import React from 'react';
import { shallow } from 'enzyme';

import { DraggableComponent as Draggable } from '../draggable.component';

describe('Draggable: Component', () => {
  const defaultProps = {};

  const component = props => <Draggable {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
