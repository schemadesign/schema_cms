import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form, Icons } from 'schemaUI';
import { append, prepend, remove, always } from 'ramda';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';
import { asMutable } from 'seamless-immutable';

import { Container } from './pageTemplateForm.styles';
import { ContextHeader } from '../contextHeader';
import { PlusButton, BackButton, NextButton } from '../navigation';
import {
  AvailableCopy,
  BinIconContainer,
  EditIconLabel,
  IconsContainer,
  IconWrapper,
  inputContainerStyles,
  inputStyles,
  menuIconStyles,
  MobileInputName,
  MobilePlusContainer,
  mobilePlusStyles,
  Subtitle,
  SwitchContainer,
  SwitchContent,
  SwitchCopy,
  Switches,
  SwitchLabel,
} from '../form/frequentComponents.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './pageTemplateForm.messages';
import {
  BLOCK_KEY,
  getDefaultPageBlock,
  PAGE_TEMPLATES_ALLOW_EDIT,
  PAGE_TEMPLATES_BLOCKS,
  PAGE_TEMPLATES_DELETE_BLOCKS,
  PAGE_TEMPLATES_IS_AVAILABLE,
  PAGE_TEMPLATES_NAME,
} from '../../../modules/pageTemplates/pageTemplates.constants';
import { CounterHeader } from '../counterHeader';
import { BLOCK_TEMPLATES_NAME } from '../../../modules/blockTemplates/blockTemplates.constants';
import { Draggable } from '../draggable';
import { PageTemplateBlock } from '../pageTemplateBlock';
import { Modal, ModalActions, ModalTitle, modalStyles } from '../modal/modal.styles';
import { CopyButton } from '../copyButton';
import { renderWhenTrue } from '../../utils/rendering';
import reportError from '../../utils/reportError';

const { EditIcon, BinIcon, MenuIcon } = Icons;
const { Switch } = Form;

export const PageTemplateForm = ({
  handleChange,
  title,
  values,
  setFieldValue,
  setValues,
  setRemoveModalOpen,
  isValid,
  blockTemplates,
  pageTemplateId,
  dirty,
  copyPageTemplate,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  const copyPageTemplateFunc = async () => {
    try {
      setLoading(true);
      setError(false);
      await copyPageTemplate({ pageTemplateId });
    } catch (e) {
      reportError(e);
      setError(true);
    } finally {
      setLoading(false);
      setCopyModalOpen(false);
    }
  };

  const copyButtonAction = async () => {
    if (dirty) {
      setCopyModalOpen(true);
      return;
    }

    copyPageTemplateFunc();
  };

  const renderCopyButton = renderWhenTrue(
    always(<CopyButton name="pageTemplateCopyButton" loading={loading} error={error} action={copyButtonAction} />)
  );

  const nameInput = (
    <Subtitle>
      <TextInput
        onChange={handleChange}
        name={PAGE_TEMPLATES_NAME}
        value={values[PAGE_TEMPLATES_NAME]}
        customInputStyles={inputStyles}
        customStyles={inputContainerStyles}
        autoWidth
        fullWidth
        autoFocus={!values[PAGE_TEMPLATES_NAME].length}
        placeholder={intl.formatMessage(messages[`${PAGE_TEMPLATES_NAME}Placeholder`])}
        {...restFormikProps}
      />
      <IconsContainer>
        <EditIconLabel htmlFor={PAGE_TEMPLATES_NAME}>
          <EditIcon />
        </EditIconLabel>
        {renderCopyButton(!!pageTemplateId)}
      </IconsContainer>
    </Subtitle>
  );
  const addBlock = () => {
    const blocks = prepend(getDefaultPageBlock(), values[PAGE_TEMPLATES_BLOCKS]);

    setFieldValue(PAGE_TEMPLATES_BLOCKS, blocks);
  };
  const removeBlock = index => {
    const removedElement = values[PAGE_TEMPLATES_BLOCKS][index];
    const newValues = { ...values };

    if (removedElement.id) {
      newValues[PAGE_TEMPLATES_DELETE_BLOCKS] = append(removedElement.id, values[PAGE_TEMPLATES_DELETE_BLOCKS]);
    }

    newValues[PAGE_TEMPLATES_BLOCKS] = remove(index, 1, values[PAGE_TEMPLATES_BLOCKS]);

    setValues({ ...newValues });
  };
  const handleMove = (dragIndex, hoverIndex) => {
    const dragCard = values[PAGE_TEMPLATES_BLOCKS][dragIndex];
    const mutableValues = asMutable(values[PAGE_TEMPLATES_BLOCKS]);

    mutableValues.splice(dragIndex, 1);
    mutableValues.splice(hoverIndex, 0, dragCard);

    setFieldValue(PAGE_TEMPLATES_BLOCKS, mutableValues);
  };
  const binIcon = setRemoveModalOpen ? (
    <BinIconContainer id="removePage" onClick={() => setRemoveModalOpen(true)}>
      <BinIcon />
    </BinIconContainer>
  ) : null;
  const blocksCount = values[PAGE_TEMPLATES_BLOCKS].length;
  const blocksOptions = blockTemplates.map(({ name, id }) => ({ label: name, value: id }));

  return (
    <Container>
      <ContextHeader title={title} subtitle={nameInput}>
        <PlusButton id="createBlock" onClick={addBlock} type="button" disabled={!isValid && !!blocksCount} />
      </ContextHeader>
      <MobileInputName>
        <TextInput
          onChange={handleChange}
          name={PAGE_TEMPLATES_NAME}
          value={values[PAGE_TEMPLATES_NAME]}
          label={<FormattedMessage {...messages[PAGE_TEMPLATES_NAME]} />}
          fullWidth
          autoFocus={!values[PAGE_TEMPLATES_NAME].length}
          isEdit
          {...restFormikProps}
        />
      </MobileInputName>
      <CounterHeader
        moveToTop
        copy={intl.formatMessage(messages.blocks)}
        count={blocksCount}
        right={
          <MobilePlusContainer>
            <PlusButton
              customStyles={mobilePlusStyles}
              id="createBlock"
              onClick={addBlock}
              type="button"
              disabled={!isValid && !!blocksCount}
            />
          </MobilePlusContainer>
        }
      />
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        {values[PAGE_TEMPLATES_BLOCKS].map((block, index) => (
          <Draggable
            key={block[BLOCK_KEY]}
            accept="box"
            onMove={handleMove}
            id={block[BLOCK_KEY]}
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
                <PageTemplateBlock
                  index={index}
                  block={block}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  blocksOptions={blocksOptions}
                  draggableIcon={draggableIcon}
                  removeBlock={removeBlock}
                  autoFocus={!!values[BLOCK_TEMPLATES_NAME].length}
                  {...restFormikProps}
                />
              );
            }}
          </Draggable>
        ))}
      </DndProvider>
      <Switches>
        <SwitchContainer>
          <SwitchContent>
            <Switch
              value={values[PAGE_TEMPLATES_IS_AVAILABLE]}
              id={PAGE_TEMPLATES_IS_AVAILABLE}
              onChange={handleChange}
            />
            <SwitchCopy>
              <SwitchLabel htmlFor={PAGE_TEMPLATES_IS_AVAILABLE}>
                <FormattedMessage {...messages[PAGE_TEMPLATES_IS_AVAILABLE]} />
              </SwitchLabel>
              <AvailableCopy>
                <FormattedMessage
                  {...messages.availableForEditors}
                  values={{ negative: values[PAGE_TEMPLATES_IS_AVAILABLE] ? '' : 'un' }}
                />
              </AvailableCopy>
            </SwitchCopy>
          </SwitchContent>
          {binIcon}
        </SwitchContainer>
        <SwitchContainer>
          <Switch value={values[PAGE_TEMPLATES_ALLOW_EDIT]} id={PAGE_TEMPLATES_ALLOW_EDIT} onChange={handleChange} />
          <SwitchCopy>
            <SwitchLabel htmlFor={PAGE_TEMPLATES_ALLOW_EDIT}>
              <FormattedMessage {...messages[PAGE_TEMPLATES_ALLOW_EDIT]} />
            </SwitchLabel>
          </SwitchCopy>
        </SwitchContainer>
      </Switches>
      <Modal ariaHideApp={false} isOpen={copyModalOpen} contentLabel="Confirm Copy" style={modalStyles}>
        <ModalTitle>
          <FormattedMessage {...messages.copyConfirmTitle} />
        </ModalTitle>
        <ModalActions>
          <BackButton onClick={() => setCopyModalOpen(false)} disabled={loading}>
            <FormattedMessage {...messages.cancelCopy} />
          </BackButton>
          <NextButton id="confirmCopyBtn" onClick={copyPageTemplateFunc} loading={loading} disabled={loading}>
            <FormattedMessage {...messages.confirmCopy} />
          </NextButton>
        </ModalActions>
      </Modal>
    </Container>
  );
};

PageTemplateForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  setRemoveModalOpen: PropTypes.func,
  values: PropTypes.object.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  isValid: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
  pageTemplateId: PropTypes.string,
  copyPageTemplate: PropTypes.func,
  dirty: PropTypes.bool,
};
