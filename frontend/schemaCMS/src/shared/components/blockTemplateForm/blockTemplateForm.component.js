import React from 'react';
import { Icons, Accordion } from 'schemaUI';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { append, prepend, remove } from 'ramda';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';
import { DndProvider } from 'react-dnd';
import { asMutable } from 'seamless-immutable';

import { Container, IconsContainer, inputContainerStyles, inputStyles, Subtitle } from './blockTemplateForm.styles';
import messages from './blockTemplateForm.messages';
import { ContextHeader } from '../contextHeader';
import { PlusButton } from '../navigation';
import { TextInput } from '../form/inputs/textInput';
import {
  BLOCK_TEMPLATES_ELEMENTS,
  BLOCK_TEMPLATES_NAME,
  BLOCK_TEMPLATE_DEFAULT_ELEMENT,
  BLOCK_TEMPLATES_DELETE_ELEMENTS,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { BlockElementTemplate } from '../blockElementTemplate';
import { CounterHeader } from '../counterHeader';
import { Draggable } from '../draggable';
import { IconWrapper, menuIconStyles } from '../../../routes/page/pageBlockList/pageBlockList.styles';

const { EditIcon, MenuIcon } = Icons;

export const BlockTemplateForm = ({
  title,
  handleChange,
  setFieldValue,
  values,
  blockTemplates,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const blocksOptions = blockTemplates.map(({ name }) => ({ label: name, value: name }));

  const nameInput = (
    <Subtitle>
      <TextInput
        onChange={handleChange}
        name={BLOCK_TEMPLATES_NAME}
        value={values[BLOCK_TEMPLATES_NAME]}
        customInputStyles={inputStyles}
        customStyles={inputContainerStyles}
        autoWidth
        fullWidth
        placeholder={intl.formatMessage(messages[`${BLOCK_TEMPLATES_NAME}Placeholder`])}
        {...restFormikProps}
      />
      <IconsContainer>
        <EditIcon />
      </IconsContainer>
    </Subtitle>
  );

  const addElement = () =>
    setFieldValue(BLOCK_TEMPLATES_ELEMENTS, prepend(BLOCK_TEMPLATE_DEFAULT_ELEMENT, values[BLOCK_TEMPLATES_ELEMENTS]));

  const removeElement = index => {
    const removedElement = values[BLOCK_TEMPLATES_ELEMENTS][index];
    setFieldValue(BLOCK_TEMPLATES_ELEMENTS, remove(index, 1, values[BLOCK_TEMPLATES_ELEMENTS]));

    if (removedElement.id) {
      setFieldValue(
        BLOCK_TEMPLATES_DELETE_ELEMENTS,
        append(removedElement.id, values[BLOCK_TEMPLATES_DELETE_ELEMENTS])
      );
    }
  };

  const handleMove = (dragIndex, hoverIndex) => {
    const dragCard = values[BLOCK_TEMPLATES_ELEMENTS][dragIndex];
    const mutableValues = asMutable(values[BLOCK_TEMPLATES_ELEMENTS]);

    mutableValues.splice(dragIndex, 1);
    mutableValues.splice(hoverIndex, 0, dragCard);

    setFieldValue(BLOCK_TEMPLATES_ELEMENTS, mutableValues);
  };
  const elementsCount = values[BLOCK_TEMPLATES_ELEMENTS].length;

  return (
    <Container>
      <ContextHeader title={title} subtitle={nameInput}>
        <PlusButton id="createElement" onClick={addElement} type="button" />
      </ContextHeader>
      <CounterHeader copy={intl.formatMessage(messages.elements)} count={elementsCount} />
      <Accordion>
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          {values[BLOCK_TEMPLATES_ELEMENTS].map((element, index) => (
            <Draggable
              key={element.id || `box-${index}`}
              accept="box"
              onMove={handleMove}
              id={element.id || `box-${index}`}
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
                  <BlockElementTemplate
                    index={index}
                    element={element}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    blocksOptions={blocksOptions}
                    draggableIcon={draggableIcon}
                    removeElement={removeElement}
                    {...restFormikProps}
                  />
                );
              }}
            </Draggable>
          ))}
        </DndProvider>
      </Accordion>
    </Container>
  );
};

BlockTemplateForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
};
