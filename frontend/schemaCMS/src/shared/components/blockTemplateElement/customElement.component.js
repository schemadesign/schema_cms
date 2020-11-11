import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import { useIntl } from 'react-intl';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';
import { DndProvider } from 'react-dnd';
import { asMutable } from 'seamless-immutable';
import { remove } from 'ramda';
import { camelize } from 'humps';

import { Draggable } from '../draggable';
import {
  ElementContainer,
  ElementsContainer,
  customElementSelectStyles,
  RemoveIcon,
  ElementInputs,
} from './blockTemplateElement.styles';
import messages from './blockTemplateElement.messages';
import { CUSTOM_ELEMENTS_TYPES, ELEMENT_NAME } from '../../../modules/blockTemplates/blockTemplates.constants';
import { Select } from '../form/select';
import { IconWrapper, menuIconStyles, mobilePlusStyles, PlusContainer } from '../form/frequentComponents.styles';
import { CounterHeader } from '../counterHeader';
import { PlusButton } from '../navigation';
import { mapAndAddOrder } from '../../utils/helpers';
import { TextInput } from '../form/inputs/textInput';

const { MenuIcon, MinusIcon } = Icons;

export const CustomElement = ({ values, valuePath, setFieldValue, handleChange, ...restFormikProps }) => {
  const orderedValues = mapAndAddOrder(values);
  const intl = useIntl();
  const elementOptions = CUSTOM_ELEMENTS_TYPES.map((type, index) => ({
    label: intl.formatMessage(messages[type]),
    value: type,
    id: `custom-element-${camelize(type)}-${index}`,
  }));
  const addElement = () =>
    setFieldValue(
      valuePath,
      orderedValues.concat({ type: '', key: Date.now(), order: orderedValues.length, name: '' })
    );
  const removeElement = index => setFieldValue(valuePath, remove(index, 1, orderedValues));
  const handleElementSelect = (value, index) => setFieldValue(`${valuePath}.${index}.type`, value);
  const handleMove = (dragIndex, hoverIndex) => {
    const dragCard = orderedValues[dragIndex];
    const mutableValues = asMutable(orderedValues);

    mutableValues.splice(dragIndex, 1);
    mutableValues.splice(hoverIndex, 0, dragCard);

    setFieldValue(valuePath, mapAndAddOrder(mutableValues));
  };

  return (
    <ElementsContainer>
      <CounterHeader
        copy={intl.formatMessage(messages.elements)}
        count={orderedValues.length}
        right={
          <PlusContainer id="addCustomElementBtnContainer">
            <PlusButton customStyles={mobilePlusStyles} id={`add-${valuePath}`} onClick={addElement} type="button" />
          </PlusContainer>
        }
      />
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        {orderedValues.map((element, index) => (
          <Draggable
            key={element.key || element.id}
            accept="custom"
            onMove={handleMove}
            id={element.key || element.id}
            index={index}
            count={orderedValues.length}
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
                <ElementContainer id={`custom-element-container-${index}`}>
                  {draggableIcon}
                  <ElementInputs>
                    <Select
                      name={`${valuePath}.${index}`}
                      value={element.type}
                      options={elementOptions}
                      id={`${valuePath}.${index}`}
                      onSelect={({ value }) => handleElementSelect(value, index)}
                      placeholder={intl.formatMessage(messages.typePlaceholder)}
                      centerIcon
                      customStyles={customElementSelectStyles}
                      {...restFormikProps}
                    />
                    <TextInput
                      name={`${valuePath}.${index}.${ELEMENT_NAME}`}
                      placeholder={intl.formatMessage(messages.namePlaceholder)}
                      onChange={handleChange}
                      fullWidth
                      autoWidth
                      value={element[ELEMENT_NAME]}
                      {...restFormikProps}
                    />
                  </ElementInputs>
                  <RemoveIcon onClick={() => removeElement(index)} id={`remove-${valuePath}.${index}`}>
                    <MinusIcon />
                  </RemoveIcon>
                </ElementContainer>
              );
            }}
          </Draggable>
        ))}
      </DndProvider>
    </ElementsContainer>
  );
};

CustomElement.propTypes = {
  valuePath: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired,
};
