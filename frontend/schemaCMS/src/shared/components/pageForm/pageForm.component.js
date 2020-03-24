import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Icons, Form, Accordion } from 'schemaUI';
import { useRouteMatch, useHistory } from 'react-router';
import { map, prepend, pipe, isEmpty, append, remove, propEq, find, propOr } from 'ramda';
import { asMutable } from 'seamless-immutable';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';

import { Container } from './pageForm.styles';
import {
  AvailableCopy,
  BinIconContainer,
  binStyles,
  IconsContainer,
  inputContainerStyles,
  inputStyles,
  MobileInputName,
  Subtitle,
  SwitchContainer,
  SwitchContent,
  SwitchCopy,
  Switches,
  SwitchLabel,
  CopySeparator,
  mobilePlusStyles,
  PlusContainer,
} from '../form/frequentComponents.styles';
import { TextInput } from '../form/inputs/textInput';
import messages from './pageForm.messages';
import { ContextHeader } from '../contextHeader';
import {
  PAGE_NAME,
  PAGE_DESCRIPTION,
  PAGE_DISPLAY_NAME,
  PAGE_KEYWORDS,
  PAGE_TEMPLATE,
  PAGE_IS_PUBLIC,
  PAGE_BLOCKS,
  PAGE_DELETE_BLOCKS,
  BLOCK_KEY,
} from '../../../modules/page/page.constants';
import { Select } from '../form/select';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../modal/modal.styles';
import { BackButton, NextButton, PlusButton } from '../navigation';
import { BlockPage } from '../blockPage';
import { Draggable } from '../draggable';
import { IconWrapper, menuIconStyles } from '../pageTemplateForm/pageTemplateForm.styles';
import { CounterHeader } from '../counterHeader';

const { EditIcon, MinusIcon, MenuIcon } = Icons;
const { Switch } = Form;
const TEMPORARY_PAGE_URL = 'https://schemacms.com';

export const PageForm = ({
  title,
  displayName,
  values,
  handleChange,
  setValues,
  setFieldValue,
  pageTemplates,
  setRemoveModalOpen,
  setTemporaryPageBlocks,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const history = useHistory();
  const { url } = useRouteMatch();
  const [changeTemplateModalOpen, setChangeTemplateModalOpen] = useState(false);
  const [temporaryPageTemplate, setTemporaryPageTemplate] = useState(null);
  const pageTemplatesOptions = pipe(
    map(({ name, id }) => ({ value: id, label: name })),
    prepend({ value: 0, label: intl.formatMessage(messages.blankTemplate) })
  )(pageTemplates);
  const setBlocks = value => {
    const templateBlocks = pipe(
      find(propEq('id', value)),
      propOr([], [PAGE_BLOCKS])
    )(pageTemplates);

    setFieldValue(PAGE_BLOCKS, templateBlocks.map(block => ({ ...block, key: block.id })));
  };
  const handleSelectPageTemplate = ({ value }) => {
    const oldValue = values[PAGE_TEMPLATE];

    if (!!oldValue && !isEmpty(values[PAGE_BLOCKS]) && oldValue !== value) {
      setTemporaryPageTemplate(value);
      return setChangeTemplateModalOpen(true);
    }

    setBlocks(value);
    return setFieldValue(PAGE_TEMPLATE, value);
  };
  const handleConfirmChangeTemplate = () => {
    setChangeTemplateModalOpen(false);

    setBlocks(temporaryPageTemplate);
    setFieldValue(PAGE_TEMPLATE, temporaryPageTemplate);
  };
  const binIcon = setRemoveModalOpen ? (
    <BinIconContainer id="removePage" onClick={() => setRemoveModalOpen(true)}>
      <MinusIcon customStyles={binStyles} />
    </BinIconContainer>
  ) : null;
  const pageUrl = `${TEMPORARY_PAGE_URL}/${displayName}`;
  const visitPage = displayName ? (
    <Fragment>
      <CopySeparator />
      <FormattedMessage {...messages.visitPage} values={{ page: <a href={pageUrl}>{pageUrl}</a> }} />
    </Fragment>
  ) : null;
  const nameInput = (
    <Subtitle>
      <TextInput
        onChange={handleChange}
        name={PAGE_NAME}
        value={values[PAGE_NAME]}
        customInputStyles={inputStyles}
        customStyles={inputContainerStyles}
        autoWidth
        fullWidth
        autoFocus={!values[PAGE_NAME].length}
        placeholder={intl.formatMessage(messages[`${PAGE_NAME}Placeholder`])}
        {...restFormikProps}
      />
      <IconsContainer>
        <EditIcon />
      </IconsContainer>
    </Subtitle>
  );
  const addBlock = () => {
    setTemporaryPageBlocks(values[PAGE_BLOCKS]);
    history.push(`${url}/add-block`);
  };
  const removeBlock = index => {
    const removedElement = values[PAGE_BLOCKS][index];
    const newValues = { ...values };

    if (removedElement.id) {
      newValues[PAGE_DELETE_BLOCKS] = append(removedElement.id, values[PAGE_DELETE_BLOCKS]);
    }

    newValues[PAGE_BLOCKS] = remove(index, 1, values[PAGE_BLOCKS]);

    setValues({ ...newValues });
  };
  const handleMove = (dragIndex, hoverIndex) => {
    const dragCard = values[PAGE_BLOCKS][dragIndex];
    const mutableValues = asMutable(values[PAGE_BLOCKS]);

    mutableValues.splice(dragIndex, 1);
    mutableValues.splice(hoverIndex, 0, dragCard);

    setFieldValue(PAGE_BLOCKS, mutableValues);
  };
  const blocksCount = values[PAGE_BLOCKS].length;

  return (
    <Container>
      <ContextHeader title={title} subtitle={nameInput} />
      <MobileInputName>
        <TextInput
          onChange={handleChange}
          name={PAGE_NAME}
          value={values[PAGE_NAME]}
          label={<FormattedMessage {...messages[PAGE_NAME]} />}
          fullWidth
          autoFocus={!values[PAGE_NAME].length}
          isEdit
          {...restFormikProps}
        />
      </MobileInputName>
      <TextInput
        onChange={handleChange}
        name={PAGE_DISPLAY_NAME}
        value={values[PAGE_DISPLAY_NAME]}
        fullWidth
        label={<FormattedMessage {...messages[PAGE_DISPLAY_NAME]} />}
        {...restFormikProps}
      />
      <TextInput
        onChange={handleChange}
        name={PAGE_DESCRIPTION}
        value={values[PAGE_DESCRIPTION]}
        fullWidth
        multiline
        label={<FormattedMessage {...messages[PAGE_DESCRIPTION]} />}
        {...restFormikProps}
      />
      <TextInput
        onChange={handleChange}
        name={PAGE_KEYWORDS}
        value={values[PAGE_KEYWORDS]}
        fullWidth
        label={<FormattedMessage {...messages[PAGE_KEYWORDS]} />}
        {...restFormikProps}
      />
      <Select
        label={intl.formatMessage(messages[PAGE_TEMPLATE])}
        name={PAGE_TEMPLATE}
        value={values[PAGE_TEMPLATE]}
        id="pageTemplateSelect"
        options={pageTemplatesOptions}
        onSelect={handleSelectPageTemplate}
        placeholder={intl.formatMessage(messages[`${PAGE_TEMPLATE}Placeholder`])}
        {...restFormikProps}
      />
      <CounterHeader
        copy={intl.formatMessage(messages.blocks)}
        count={blocksCount}
        right={
          <PlusContainer>
            <PlusButton
              customStyles={mobilePlusStyles}
              id="addBlock"
              onClick={addBlock}
              type="button"
              disabled={!restFormikProps.isValid && !!blocksCount}
            />
          </PlusContainer>
        }
      />
      <Accordion>
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          {values[PAGE_BLOCKS].map((block, index) => (
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
                  <BlockPage
                    index={index}
                    block={block}
                    draggableIcon={draggableIcon}
                    removeBlock={removeBlock}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
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
            <Switch value={values[PAGE_IS_PUBLIC]} id={PAGE_IS_PUBLIC} onChange={handleChange} />
            <SwitchCopy isLink>
              <SwitchLabel htmlFor={PAGE_IS_PUBLIC}>
                <FormattedMessage {...messages[PAGE_IS_PUBLIC]} />
              </SwitchLabel>
              <AvailableCopy>
                <FormattedMessage
                  {...messages.pageAvailability}
                  values={{
                    availability: intl.formatMessage(messages[values[PAGE_IS_PUBLIC] ? 'publicCopy' : 'privateCopy']),
                  }}
                />
                {visitPage}
              </AvailableCopy>
            </SwitchCopy>
          </SwitchContent>
          {binIcon}
        </SwitchContainer>
      </Switches>
      <Modal ariaHideApp={false} isOpen={changeTemplateModalOpen} contentLabel="Confirm Change" style={modalStyles}>
        <ModalTitle>
          <FormattedMessage {...messages.changeTitle} />
        </ModalTitle>
        <ModalActions>
          <BackButton onClick={() => setChangeTemplateModalOpen(false)}>
            <FormattedMessage {...messages.cancelChange} />
          </BackButton>
          <NextButton id="confirmChangeTemplateBtn" onClick={handleConfirmChangeTemplate}>
            <FormattedMessage {...messages.confirmChange} />
          </NextButton>
        </ModalActions>
      </Modal>
    </Container>
  );
};

PageForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  setTemporaryPageBlocks: PropTypes.func.isRequired,
  setRemoveModalOpen: PropTypes.func,
  values: PropTypes.object.isRequired,
  pageTemplates: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  displayName: PropTypes.string,
};
