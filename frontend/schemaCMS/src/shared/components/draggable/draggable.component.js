import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';

import { Container } from './draggable.styles';

const DRAGGING_OPACITY = 0.4;
const DEFAULT_OPACITY = 1;

export const Draggable = ({ onMove, children, accept, id, index }) => {
  const ref = useRef(null);
  const dragRef = useRef(null);
  const [, drop] = useDrop({
    accept,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: accept, id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const makeDraggable = content => <span ref={dragRef}>{content}</span>;

  const opacity = isDragging ? DRAGGING_OPACITY : DEFAULT_OPACITY;
  drag(drop(dragRef));

  return (
    <Container ref={ref} style={{ opacity }}>
      {children(makeDraggable)}
    </Container>
  );
};

Draggable.propTypes = {
  accept: PropTypes.string.isRequired,
  id: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.any,
  onMove: PropTypes.func.isRequired,
};
