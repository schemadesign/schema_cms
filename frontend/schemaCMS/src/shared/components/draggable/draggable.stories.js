import React from 'react';
import { storiesOf } from '@storybook/react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import { Draggable } from './draggable.component';

export const defaultProps = {
  accept: 'TYPE',
  id: 'id',
  index: 0,
  onMove: Function.prototype,
};

storiesOf('Draggable', module).add('Default', () => (
  <DndProvider backend={Backend}>
    <Draggable {...defaultProps}>{() => {}}</Draggable>
  </DndProvider>
));
