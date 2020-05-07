import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icons, Accordion, AccordionDetails, AccordionHeader, AccordionPanel } from 'schemaUI';
import { asMutable } from 'seamless-immutable';
import { MultiBackend } from 'dnd-multi-backend';
import { DndProvider } from 'react-dnd';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';
import { useIntl } from 'react-intl';
import { pathOr, pipe, map, remove } from 'ramda';

import { getValuePath, mapAndAddOrder, setDefaultValue } from '../../utils/helpers';
import { BLOCK_ID, BLOCK_KEY } from '../../../modules/page/page.constants';
import { IconWrapper, menuIconStyles, mobilePlusStyles, PlusContainer } from '../form/frequentComponents.styles';
import { Draggable } from '../draggable';
import { CounterHeader } from '../counterHeader';
import { PlusButton } from '../navigation';
import { getElementComponent } from './blockElement.component';
import { SetElement, SetElementContent, RemoveContainer } from './blockElement.styles';
import messages from './blockElement.messages';

const { MenuIcon, CloseIcon } = Icons;

export const CustomElement = ({ element, blockPath, handleChange, index, setFieldValue, ...restFormikProps }) => {
  const intl = useIntl();
  const valuePath = getValuePath({ blockPath, index });
  const removeElementsPath = getValuePath({ blockPath, index, elementValue: 'deleteElementsSets' });
  const { value, deleteElementsSets = [] } = element;
  const handleMove = (dragIndex, hoverIndex) => {
    const dragCard = value[dragIndex];
    const mutableValues = asMutable(value);

    mutableValues.splice(dragIndex, 1);
    mutableValues.splice(hoverIndex, 0, dragCard);

    setFieldValue(valuePath, mapAndAddOrder(mutableValues));
  };
  const addSet = () => {
    const elements = pipe(
      pathOr([], ['params', 'elements']),
      map(setDefaultValue)
    )(element);

    setFieldValue(valuePath, [...value, { key: Date.now(), elements, order: value.length }]);
  };

  const removeSet = index => () => {
    const newValue = pipe(
      remove(index, 1),
      mapAndAddOrder
    )(value);
    const removedId = value[index].id;

    if (value[index].id) {
      setFieldValue(removeElementsPath, deleteElementsSets.concat(removedId));
    }

    setFieldValue(valuePath, newValue);
    setTimeout(() => restFormikProps.validateForm());
  };

  return (
    <Fragment>
      <CounterHeader
        copy={intl.formatMessage(messages.set)}
        count={value.length}
        right={
          <PlusContainer>
            <PlusButton customStyles={mobilePlusStyles} id={`add-${valuePath}`} onClick={addSet} type="button" />
          </PlusContainer>
        }
      />
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        {value.map((block, parentIndex) => (
          <Draggable
            key={block[BLOCK_KEY] || block[BLOCK_ID]}
            accept="customElement"
            onMove={handleMove}
            id={block[BLOCK_KEY] || block[BLOCK_ID]}
            index={parentIndex}
            count={value.length}
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
                <SetElement>
                  {draggableIcon}
                  <Accordion>
                    <SetElementContent>
                      {block.elements.map((item, index) => (
                        <AccordionPanel key={index}>
                          <AccordionHeader>{intl.formatMessage(messages[item.type])}</AccordionHeader>
                          <AccordionDetails>
                            {getElementComponent({
                              element: item,
                              setFieldValue,
                              index,
                              handleChange,
                              blockPath: `${valuePath}.${parentIndex}`,
                              ...restFormikProps,
                            })}
                          </AccordionDetails>
                        </AccordionPanel>
                      ))}
                    </SetElementContent>
                  </Accordion>
                  <RemoveContainer>
                    <CloseIcon
                      customStyles={{ width: 40, height: 40 }}
                      id={`remove-${valuePath}.${parentIndex}`}
                      onClick={removeSet(parentIndex)}
                    />
                  </RemoveContainer>
                </SetElement>
              );
            }}
          </Draggable>
        ))}
      </DndProvider>
    </Fragment>
  );
};
CustomElement.propTypes = {
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
