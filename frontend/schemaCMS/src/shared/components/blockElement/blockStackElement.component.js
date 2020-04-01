import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icons } from 'schemaUI';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';
import { asMutable } from 'seamless-immutable';
import { useIntl } from 'react-intl';
import { propEq, find } from 'ramda';

import { Draggable } from '../draggable';
import { IconWrapper, menuIconStyles } from '../pageTemplateForm/pageTemplateForm.styles';
import { PageBlock } from '../pageBlock';
import { CounterHeader } from '../counterHeader';
import messages from './blockElement.messages';
import { mobilePlusStyles, PlusContainer } from '../form/frequentComponents.styles';
import { Container } from '../pageForm/pageForm.styles';
import { PlusButton } from '../navigation';
import { BLOCK_ELEMENTS, BLOCK_ID, BLOCK_KEY } from '../../../modules/page/page.constants';
import { ELEMENT_VALUE } from '../../../modules/blockTemplates/blockTemplates.constants';

const { MenuIcon } = Icons;

export const BlockStackElement = ({
  element: {
    value = [],
    params: { block },
  },
  blockTemplates,
  setFieldValue,
  handleChange,
  blockPath,
  index,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const valuePath = `${blockPath}.${BLOCK_ELEMENTS}.${index}.${ELEMENT_VALUE}`;
  const handleMove = (dragIndex, hoverIndex) => {
    const dragCard = value[dragIndex];
    const mutableValues = asMutable(value);

    mutableValues.splice(dragIndex, 1);
    mutableValues.splice(hoverIndex, 0, dragCard);

    setFieldValue(valuePath, mutableValues);
  };
  const removeBlock = () => {};
  const addBlock = () => {
    const { name, id, ...rest } = find(propEq('id', block), blockTemplates);
    const emptyBlock = { ...rest, name: '', key: Date.now(), type: name, block: id };
    setFieldValue(valuePath, value.concat(emptyBlock));
  };
  const blocksCount = value.length;

  return (
    <Container>
      <CounterHeader
        copy={intl.formatMessage(messages.blocks)}
        count={blocksCount}
        right={
          <PlusContainer>
            <PlusButton customStyles={mobilePlusStyles} id="addBlock" onClick={addBlock} type="button" />
          </PlusContainer>
        }
      />
      <Accordion>
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          {value.map((block, index) => (
            <Draggable
              key={block[BLOCK_KEY] || block[BLOCK_ID]}
              accept="blockStack"
              onMove={handleMove}
              id={block[BLOCK_KEY] || block[BLOCK_ID]}
              index={index}
              count={blocksCount}
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
                  <PageBlock
                    index={index}
                    block={block}
                    valuePath={valuePath}
                    draggableIcon={draggableIcon}
                    removeBlock={removeBlock}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    blockTemplates={blockTemplates}
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

BlockStackElement.propTypes = {
  element: PropTypes.object.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
