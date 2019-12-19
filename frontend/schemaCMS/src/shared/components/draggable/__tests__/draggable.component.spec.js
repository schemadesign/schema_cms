import React from 'react';
import { shallow } from 'enzyme';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import { Draggable } from '../draggable.component';
import { defaultProps } from '../draggable.stories';

describe('Draggable: Component', () => {
  const component = props => (
    <DndProvider backend={Backend}>
      <Draggable {...defaultProps} {...props} />
    </DndProvider>
  );

  const render = (props = {}) => shallow(component(props));

  it('should render correctly', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });
});
