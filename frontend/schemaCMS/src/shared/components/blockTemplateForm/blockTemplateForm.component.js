import React from 'react';
import { Accordion, Form, Icons } from 'schemaUI';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { append, identity, ifElse, prepend, propIs, remove, pipe } from 'ramda';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';
import { DndProvider } from 'react-dnd';
import { asMutable } from 'seamless-immutable';

import {
  Container,
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
} from './blockTemplateForm.styles';
import messages from './blockTemplateForm.messages';
import { ContextHeader } from '../contextHeader';
import { PlusButton } from '../navigation';
import { TextInput } from '../form/inputs/textInput';
import {
  BLOCK_TEMPLATE_DEFAULT_ELEMENT,
  BLOCK_TEMPLATES_ALLOW_ADD,
  BLOCK_TEMPLATES_DELETE_ELEMENTS,
  BLOCK_TEMPLATES_ELEMENTS,
  BLOCK_TEMPLATES_IS_AVAILABLE,
  BLOCK_TEMPLATES_NAME,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { BlockElementTemplate } from '../blockElementTemplate';
import { CounterHeader } from '../counterHeader';
import { Draggable } from '../draggable';
import { IconWrapper, menuIconStyles } from '../../../routes/page/pageBlockList/pageBlockList.styles';

const { EditIcon, MenuIcon, MinusIcon } = Icons;
const { Switch } = Form;

export const BlockTemplateForm = ({
  title,
  handleChange,
  setValues,
  setFieldValue,
  values,
  blockTemplates,
  setRemoveModalOpen = null,
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

  const addElement = () => {
    const elements = pipe(
      prepend(BLOCK_TEMPLATE_DEFAULT_ELEMENT),
      data => data.map(ifElse(propIs(Number, 'id'), identity, (element, index) => ({ ...element, id: `box-${index}` })))
    )(values[BLOCK_TEMPLATES_ELEMENTS]);

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
    <BinIconContainer onClick={() => setRemoveModalOpen(true)}>
      <MinusIcon customStyles={binStyles} />
    </BinIconContainer>
  ) : null;

  return (
    <Container>
      <ContextHeader title={title} subtitle={nameInput}>
        <PlusButton id="createElement" onClick={addElement} type="button" />
      </ContextHeader>
      <MobileInputName>
        <TextInput
          onChange={handleChange}
          name={BLOCK_TEMPLATES_NAME}
          value={values[BLOCK_TEMPLATES_NAME]}
          label={<FormattedMessage {...messages[BLOCK_TEMPLATES_NAME]} />}
          fullWidth
          {...restFormikProps}
        />
      </MobileInputName>
      <CounterHeader
        copy={intl.formatMessage(messages.elements)}
        count={elementsCount}
        right={
          <MobilePlusContainer>
            <PlusButton customStyles={mobilePlusStyles} id="createElement" onClick={addElement} type="button" />
          </MobilePlusContainer>
        }
      />
      <Accordion>
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          {values[BLOCK_TEMPLATES_ELEMENTS].map((element, index) => (
            <Draggable
              key={element.id || index}
              accept="box"
              onMove={handleMove}
              id={element.id || index}
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
                <FormattedMessage {...messages.availableForEditors} />
              </AvailableCopy>
            </SwitchCopy>
          </SwitchContent>
          {binIcon}
        </SwitchContainer>
        <SwitchContainer>
          <Switch value={values[BLOCK_TEMPLATES_ALLOW_ADD]} id={BLOCK_TEMPLATES_ALLOW_ADD} onChange={handleChange} />
          <SwitchCopy>
            <SwitchLabel htmlFor={BLOCK_TEMPLATES_ALLOW_ADD}>
              <FormattedMessage {...messages[BLOCK_TEMPLATES_ALLOW_ADD]} />
            </SwitchLabel>
          </SwitchCopy>
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
  values: PropTypes.object.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
};
