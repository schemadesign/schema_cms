import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import { useIntl } from 'react-intl';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';
import { DndProvider } from 'react-dnd';
import { asMutable } from 'seamless-immutable';

import { Draggable } from '../draggable';
import { ElementContainer, ElementsContainer, customElementSelectStyles } from './blockTemplateElement.styles';
import messages from './blockTemplateElement.messages';
import { CUSTOM_ELEMENTS_TYPES } from '../../../modules/blockTemplates/blockTemplates.constants';
import { Select } from '../form/select';
import { IconWrapper, menuIconStyles, mobilePlusStyles, PlusContainer } from '../form/frequentComponents.styles';
import { CounterHeader } from '../counterHeader';
import { PlusButton } from '../navigation';
import { mapAndAddOrder } from '../../utils/helpers';

const { MenuIcon } = Icons;

export const CustomElement = ({ values, valuePath, setFieldValue, ...restFormikProps }) => {
  const orderedValues = mapAndAddOrder(values);
  const intl = useIntl();
  const elementOptions = CUSTOM_ELEMENTS_TYPES.map(type => ({
    label: intl.formatMessage(messages[type]),
    value: type,
  }));
  const addElement = () =>
    setFieldValue(valuePath, values.concat({ type: '', key: Date.now(), order: orderedValues.length }));
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
        count={values.length}
        right={
          <PlusContainer>
            <PlusButton customStyles={mobilePlusStyles} id="addBlock" onClick={addElement} type="button" />
          </PlusContainer>
        }
      />
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        {values.map((element, index) => (
          <Draggable
            key={element.key || element.id}
            accept="box"
            onMove={handleMove}
            id={element.key || element.id}
            index={index}
            count={values.length}
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
                <ElementContainer>
                  {draggableIcon}
                  <Select
                    name={`${valuePath}.${index}`}
                    value={values[index].type}
                    options={elementOptions}
                    onSelect={({ value }) => handleElementSelect(value, index)}
                    placeholder={intl.formatMessage(messages.typePlaceholder)}
                    centerIcon
                    customStyles={customElementSelectStyles}
                    {...restFormikProps}
                  />
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
  values: PropTypes.array.isRequired,
};
