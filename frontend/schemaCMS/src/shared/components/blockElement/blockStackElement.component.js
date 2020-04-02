import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icons } from 'schemaUI';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';
import { asMutable } from 'seamless-immutable';
import { useIntl } from 'react-intl';
import { propEq, find, append, remove } from 'ramda';

import { Draggable } from '../draggable';
import { PageBlock } from '../pageBlock';
import { CounterHeader } from '../counterHeader';
import messages from './blockElement.messages';
import { IconWrapper, menuIconStyles, mobilePlusStyles, PlusContainer } from '../form/frequentComponents.styles';
import { PlusButton } from '../navigation';
import { BLOCK_ID, BLOCK_KEY, PAGE_DELETE_BLOCKS } from '../../../modules/page/page.constants';

const { MenuIcon } = Icons;

export const BlockStackElement = ({
  element: {
    value = [],
    params: { block },
  },
  blockTemplates,
  setFieldValue,
  handleChange,
  formikFieldPath,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const handleMove = (dragIndex, hoverIndex) => {
    const dragCard = value[dragIndex];
    const mutableValues = asMutable(value);

    mutableValues.splice(dragIndex, 1);
    mutableValues.splice(hoverIndex, 0, dragCard);

    setFieldValue(formikFieldPath, mutableValues);
  };

  const removeBlock = index => {
    const removedElement = value[index];

    if (removedElement.id) {
      setFieldValue(
        `${formikFieldPath}.${PAGE_DELETE_BLOCKS}`,
        append(removedElement.id, value[PAGE_DELETE_BLOCKS] || [])
      );
    }

    setFieldValue(formikFieldPath, remove(index, 1, value));
  };
  const addBlock = () => {
    const { name, id, ...rest } = find(propEq('id', block), blockTemplates);
    const emptyBlock = { ...rest, name: '', key: Date.now(), type: name, block: id };
    setFieldValue(formikFieldPath, value.concat(emptyBlock));
  };
  const blocksCount = value.length;

  return (
    <Fragment>
      <CounterHeader
        copy={intl.formatMessage(messages.blocks)}
        count={blocksCount}
        right={
          <PlusContainer>
            <PlusButton customStyles={mobilePlusStyles} id="addBlockStack" onClick={addBlock} type="button" />
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
                    formikFieldPath={formikFieldPath}
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
    </Fragment>
  );
};

BlockStackElement.propTypes = {
  element: PropTypes.object.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  formikFieldPath: PropTypes.string.isRequired,
};
