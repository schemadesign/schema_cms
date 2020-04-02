import React from 'react';
import { Accordion, Form, Icons } from 'schemaUI';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { append, both, complement, any, prepend, propEq, remove, pipe, map, prop, filter } from 'ramda';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';
import { DndProvider } from 'react-dnd';
import { asMutable } from 'seamless-immutable';
import { useParams } from 'react-router';

import {
  IconsContainer,
  inputContainerStyles,
  inputStyles,
  MobileInputName,
  MobilePlusContainer,
  mobilePlusStyles,
  Subtitle,
  Switches,
  SwitchContainer,
  SwitchLabel,
  AvailableCopy,
  SwitchContent,
  SwitchCopy,
  binStyles,
  BinIconContainer,
  menuIconStyles,
  IconWrapper,
} from '../form/frequentComponents.styles';
import { Container } from './blockTemplateForm.styles';
import messages from './blockTemplateForm.messages';
import { ContextHeader } from '../contextHeader';
import { PlusButton } from '../navigation';
import { TextInput } from '../form/inputs/textInput';
import {
  BLOCK_TEMPLATES_DELETE_ELEMENTS,
  BLOCK_TEMPLATES_ELEMENTS,
  BLOCK_TEMPLATES_IS_AVAILABLE,
  BLOCK_TEMPLATES_NAME,
  ELEMENT_KEY,
  getDefaultBlockElement,
  STACK_TYPE,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { BlockTemplateElement } from '../blockTemplateElement';
import { CounterHeader } from '../counterHeader';
import { Draggable } from '../draggable';

const { EditIcon, MenuIcon, MinusIcon } = Icons;
const { Switch } = Form;

export const BlockTemplateForm = ({
  title,
  handleChange,
  setValues,
  setFieldValue,
  values,
  isValid,
  blockTemplates,
  setRemoveModalOpen = null,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const { blockTemplateId } = useParams();
  const blocksOptions = pipe(
    filter(
      both(
        complement(propEq('id', parseInt(blockTemplateId, 10))),
        complement(
          pipe(
            prop('elements'),
            any(propEq('type', STACK_TYPE))
          )
        )
      )
    ),
    map(({ name, id }) => ({ label: name, value: id }))
  )(blockTemplates);

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
        autoFocus={!values[BLOCK_TEMPLATES_NAME].length}
        placeholder={intl.formatMessage(messages[`${BLOCK_TEMPLATES_NAME}Placeholder`])}
        {...restFormikProps}
      />
      <IconsContainer>
        <EditIcon />
      </IconsContainer>
    </Subtitle>
  );

  const addElement = () => {
    const elements = prepend(getDefaultBlockElement(), values[BLOCK_TEMPLATES_ELEMENTS]);

    setFieldValue(BLOCK_TEMPLATES_ELEMENTS, elements);
  };

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
  const binIcon = setRemoveModalOpen ? (
    <BinIconContainer id="removeBlock" onClick={() => setRemoveModalOpen(true)}>
      <MinusIcon customStyles={binStyles} />
    </BinIconContainer>
  ) : null;

  return (
    <Container>
      <ContextHeader title={title} subtitle={nameInput}>
        <PlusButton id="createElement" onClick={addElement} type="button" disabled={!isValid && !!elementsCount} />
      </ContextHeader>
      <MobileInputName>
        <TextInput
          onChange={handleChange}
          name={BLOCK_TEMPLATES_NAME}
          value={values[BLOCK_TEMPLATES_NAME]}
          label={<FormattedMessage {...messages[BLOCK_TEMPLATES_NAME]} />}
          fullWidth
          autoFocus={!values[BLOCK_TEMPLATES_NAME].length}
          {...restFormikProps}
        />
      </MobileInputName>
      <CounterHeader
        moveToTop
        copy={intl.formatMessage(messages.elements)}
        count={elementsCount}
        right={
          <MobilePlusContainer>
            <PlusButton
              customStyles={mobilePlusStyles}
              id="createElement"
              onClick={addElement}
              type="button"
              disabled={!isValid && !!elementsCount}
            />
          </MobilePlusContainer>
        }
      />
      <Accordion>
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          {values[BLOCK_TEMPLATES_ELEMENTS].map((element, index) => (
            <Draggable
              key={element[ELEMENT_KEY]}
              accept="box"
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
                  <BlockTemplateElement
                    index={index}
                    element={element}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    blocksOptions={blocksOptions}
                    draggableIcon={draggableIcon}
                    removeElement={removeElement}
                    autoFocus={!!values[BLOCK_TEMPLATES_NAME].length}
                    {...restFormikProps}
                  />
                );
              }}
            </Draggable>
          ))}
        </DndProvider>
      </Accordion>
      <Switches>
        <SwitchContainer>
          <SwitchContent>
            <Switch
              value={values[BLOCK_TEMPLATES_IS_AVAILABLE]}
              id={BLOCK_TEMPLATES_IS_AVAILABLE}
              onChange={handleChange}
            />
            <SwitchCopy>
              <SwitchLabel htmlFor={BLOCK_TEMPLATES_IS_AVAILABLE}>
                <FormattedMessage {...messages[BLOCK_TEMPLATES_IS_AVAILABLE]} />
              </SwitchLabel>
              <AvailableCopy>
                <FormattedMessage
                  {...messages.availableForEditors}
                  values={{ negative: values[BLOCK_TEMPLATES_IS_AVAILABLE] ? '' : 'un' }}
                />
              </AvailableCopy>
            </SwitchCopy>
          </SwitchContent>
          {binIcon}
        </SwitchContainer>
      </Switches>
    </Container>
  );
};

BlockTemplateForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  setRemoveModalOpen: PropTypes.func,
  setValues: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
};
