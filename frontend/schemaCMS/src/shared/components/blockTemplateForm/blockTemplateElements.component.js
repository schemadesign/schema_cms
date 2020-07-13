import React from 'react';
import { Accordion, Icons, AccordionPanel } from 'schemaUI';
import PropTypes from 'prop-types';
import { always, append, ifElse, isEmpty, remove } from 'ramda';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';
import { DndProvider } from 'react-dnd';
import { asMutable } from 'seamless-immutable';
import { useIntl } from 'react-intl';

import { menuIconStyles, IconWrapper } from '../form/frequentComponents.styles';
import {
  BLOCK_TEMPLATES_DELETE_ELEMENTS,
  BLOCK_TEMPLATES_ELEMENTS,
  BLOCK_TEMPLATES_NAME,
  ELEMENT_KEY,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { BlockTemplateElement } from '../blockTemplateElement';
import { Draggable } from '../draggable';
import messages from './blockTemplateForm.messages';
import { getPropsWhenNotEmpty } from '../../utils/helpers';

const { MenuIcon } = Icons;

export const BlockTemplateElements = ({ handleChange, setValues, setFieldValue, values, ...restFormikProps }) => {
  const intl = useIntl();
  const removeElement = index => {
    const removedElement = values[BLOCK_TEMPLATES_ELEMENTS][index];
    const newValues = { ...values };

    if (removedElement.id) {
      newValues[BLOCK_TEMPLATES_DELETE_ELEMENTS] = append(removedElement.id, values[BLOCK_TEMPLATES_DELETE_ELEMENTS]);
    }

    newValues[BLOCK_TEMPLATES_ELEMENTS] = remove(index, 1, values[BLOCK_TEMPLATES_ELEMENTS]);

    setValues({ ...newValues });
  };

  const handleMove = (dragIndex, hoverIndex) => {
    const dragCard = values[BLOCK_TEMPLATES_ELEMENTS][dragIndex];
    const mutableValues = asMutable(values[BLOCK_TEMPLATES_ELEMENTS]);

    mutableValues.splice(dragIndex, 1);
    mutableValues.splice(hoverIndex, 0, dragCard);

    setFieldValue(BLOCK_TEMPLATES_ELEMENTS, mutableValues);
  };
  const elementsCount = values[BLOCK_TEMPLATES_ELEMENTS].length;

<<<<<<< HEAD
  const accordionCopyProps = getPropsWhenNotEmpty(values[BLOCK_TEMPLATES_ELEMENTS], {
    collapseCopy: intl.formatMessage(messages.collapseCopy),
    expandCopy: intl.formatMessage(messages.expandCopy),
  });

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Accordion {...accordionCopyProps} newOpen>
=======
  const accordionProps = ifElse(
    isEmpty,
    always({}),
    always({
      collapseCopy: intl.formatMessage(messages.collapseCopy),
      expandCopy: intl.formatMessage(messages.expandCopy),
    })
  )(values[BLOCK_TEMPLATES_ELEMENTS]);

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Accordion {...accordionProps} newOpen>
>>>>>>> Render accordion details on open and fix showing collapse button
        {values[BLOCK_TEMPLATES_ELEMENTS].map((element, index) => (
          <Draggable
            accept="box"
            key={element[ELEMENT_KEY]}
            onMove={handleMove}
            id={element[ELEMENT_KEY]}
            index={index}
            count={elementsCount}
          >
            {drag => {
              const draggableIcon = drag(
                <div>
                  <IconWrapper>
                    <MenuIcon customStyles={menuIconStyles} />
                  </IconWrapper>
                </div>
              );

              return (
                <AccordionPanel id={element[ELEMENT_KEY]}>
                  <BlockTemplateElement
                    index={index}
                    element={element}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    draggableIcon={draggableIcon}
                    removeElement={removeElement}
                    autoFocus={!!values[BLOCK_TEMPLATES_NAME].length}
                    {...restFormikProps}
                  />
                </AccordionPanel>
              );
            }}
          </Draggable>
        ))}
      </Accordion>
    </DndProvider>
  );
};

BlockTemplateElements.propTypes = {
  handleChange: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};
