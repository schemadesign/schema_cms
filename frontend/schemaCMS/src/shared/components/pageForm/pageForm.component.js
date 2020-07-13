import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Icons, Form, Accordion } from 'schemaUI';
import { useRouteMatch, useHistory } from 'react-router';
import {
  map,
  prepend,
  pipe,
  isEmpty,
  append,
  remove,
  propEq,
  find,
  propOr,
  omit,
  isNil,
  prop,
  filter,
  complement,
  always,
  ifElse,
} from 'ramda';
import { asMutable } from 'seamless-immutable';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';

import { Container, SelectContainer } from './pageForm.styles';
import {
  AvailableCopy,
  BinIconContainer,
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
  IconWrapper,
  menuIconStyles,
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
  BLOCK_ID,
  PAGE_TAGS,
} from '../../../modules/page/page.constants';
import { Select } from '../form/select';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../modal/modal.styles';
import { BackButton, NextButton, PlusButton } from '../navigation';
import { PageBlock } from '../pageBlock';
import { Draggable } from '../draggable';
import { CounterHeader } from '../counterHeader';
import { getPropsWhenNotEmpty, getPageUrlOptions, setDefaultValue } from '../../utils/helpers';
import { TagSearch } from '../tagSearch';
import { CopyButton } from '../copyButton';
import { renderWhenTrue } from '../../utils/rendering';

const { EditIcon, BinIcon, MenuIcon } = Icons;
const { Switch, Label } = Form;

export const PageForm = ({
  title,
  pageUrl,
  values,
  domain = '',
  pageId = null,
  handleChange,
  dirty = false,
  setValues,
  copyPage,
  setFieldValue,
  pageTemplates,
  setRemoveModalOpen,
  internalConnections,
  tagCategories,
  states,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const history = useHistory();
  const { url } = useRouteMatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [changeTemplateModalOpen, setChangeTemplateModalOpen] = useState(false);
  const [temporaryPageTemplate, setTemporaryPageTemplate] = useState(null);
  const pageTemplatesOptions = pipe(
    map(({ name, id }) => ({ value: id, label: name })),
    prepend({ value: 0, label: intl.formatMessage(messages.blankTemplate) })
  )(pageTemplates);

  const setBlocks = value => {
    const templateBlocks = pipe(
      find(propEq('id', value)),
      propOr([], [PAGE_BLOCKS]),
      map(({ id, elements, ...block }) => ({
        ...block,
        name: block.type,
        key: id,
        elements: map(
          pipe(
            omit(['id', 'template']),
            setDefaultValue
          ),
          elements
        ),
      }))
    )(pageTemplates);
    const currentBlocks = pipe(
      prop(PAGE_BLOCKS),
      map(prop('id')),
      filter(complement(isNil))
    )(values);

    setFieldValue(PAGE_BLOCKS, templateBlocks);
    setFieldValue(PAGE_DELETE_BLOCKS, values[PAGE_DELETE_BLOCKS].concat(currentBlocks));
    setTimeout(() => restFormikProps.validateForm());
  };
  const handleSelectPageTemplate = ({ value }) => {
    if (!isEmpty(values[PAGE_BLOCKS])) {
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
  const copyPageFunc = async () => {
    try {
      setLoading(true);
      setError(false);
      await copyPage({ pageId });
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

    copyPageFunc();
  };
  const binIcon = setRemoveModalOpen ? (
    <BinIconContainer id="removePage" onClick={() => setRemoveModalOpen(true)}>
      <BinIcon />
    </BinIconContainer>
  ) : null;
  const visitPage = pageUrl ? (
    <Fragment>
      <CopySeparator />
      <FormattedMessage {...messages.visitPage} values={{ page: <a href={pageUrl}>{pageUrl}</a> }} />
    </Fragment>
  ) : null;
  const renderCopyButton = renderWhenTrue(
    always(<CopyButton name="pageCopyButton" loading={loading} error={error} action={copyButtonAction} />)
  );
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
        {renderCopyButton(!!pageId)}
      </IconsContainer>
    </Subtitle>
  );
  const allowEdit = pipe(
    find(propEq('id', values[PAGE_TEMPLATE])),
    propOr(values[PAGE_TEMPLATE] === 0, 'allowEdit')
  )(pageTemplates);
  const plusButton = allowEdit ? (
    <PlusButton
      customStyles={mobilePlusStyles}
      id="addBlock"
      onClick={() => history.push(`${url}/add-block`, { page: values })}
      type="button"
    />
  ) : null;
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
  const handleDisplayNameBlur = e => {
    setFieldValue(PAGE_DISPLAY_NAME, values[PAGE_DISPLAY_NAME].toLowerCase());
    restFormikProps.handleBlur(e);
  };

  const pagerUrlOptions = getPageUrlOptions({ internalConnections, domain, pageId });
  const stateOptions = states.map(({ id, name, datasource }) => ({ label: `${datasource}   >   ${name}`, value: id }));
<<<<<<< HEAD
  const accordionCopyProps = getPropsWhenNotEmpty(values[PAGE_BLOCKS], {
    collapseCopy: intl.formatMessage(messages.collapseCopy),
    expandCopy: intl.formatMessage(messages.expandCopy),
  });
=======
  const accordionProps = ifElse(
    isEmpty,
    always({}),
    always({
      collapseCopy: intl.formatMessage(messages.collapseCopy),
      expandCopy: intl.formatMessage(messages.expandCopy),
    })
  )(values[PAGE_BLOCKS]);
>>>>>>> Render accordion details on open and fix showing collapse button

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
        onBlur={handleDisplayNameBlur}
        name={PAGE_DISPLAY_NAME}
        value={values[PAGE_DISPLAY_NAME]}
        fullWidth
        isEdit
        label={<FormattedMessage {...messages[PAGE_DISPLAY_NAME]} />}
        {...restFormikProps}
      />
      <TextInput
        onChange={handleChange}
        name={PAGE_DESCRIPTION}
        value={values[PAGE_DESCRIPTION]}
        fullWidth
        multiline
        isEdit
        label={<FormattedMessage {...messages[PAGE_DESCRIPTION]} />}
        {...restFormikProps}
      />
      <TextInput
        onChange={handleChange}
        name={PAGE_KEYWORDS}
        value={values[PAGE_KEYWORDS]}
        fullWidth
        isEdit
        label={<FormattedMessage {...messages[PAGE_KEYWORDS]} />}
        {...restFormikProps}
      />
      <Label>
        <FormattedMessage {...messages[PAGE_TAGS]} />
      </Label>
      <TagSearch
        tagCategories={tagCategories}
        values={values[PAGE_TAGS]}
        setFieldValue={setFieldValue}
        valuePath={PAGE_TAGS}
      />
      <SelectContainer>
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
      </SelectContainer>
      <CounterHeader
        copy={intl.formatMessage(messages.blocks)}
        count={blocksCount}
        right={<PlusContainer>{plusButton}</PlusContainer>}
      />

      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
<<<<<<< HEAD
        <Accordion {...accordionCopyProps}>
=======
        <Accordion {...accordionProps}>
>>>>>>> Render accordion details on open and fix showing collapse button
          {values[PAGE_BLOCKS].map((block, index) => (
            <Draggable
              key={block[BLOCK_KEY] || block[BLOCK_ID]}
              accept="box"
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
                const blockAdditionalProps = allowEdit ? { removeBlock, draggableIcon } : {};

                return (
                  <PageBlock
                    index={index}
                    block={block}
                    formikFieldPath={PAGE_BLOCKS}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    pagerUrlOptions={pagerUrlOptions}
                    stateOptions={stateOptions}
                    {...blockAdditionalProps}
                    {...restFormikProps}
                  />
                );
              }}
            </Draggable>
          ))}
        </Accordion>
      </DndProvider>
      <Switches>
        <SwitchContainer>
          <SwitchContent>
            <Switch value={values[PAGE_IS_PUBLIC]} id={PAGE_IS_PUBLIC} onChange={handleChange} />
            <SwitchCopy>
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
      <Modal ariaHideApp={false} isOpen={copyModalOpen} contentLabel="Confirm Copy" style={modalStyles}>
        <ModalTitle>
          <FormattedMessage {...messages.copyConfirmTitle} />
        </ModalTitle>
        <ModalActions>
          <BackButton onClick={() => setCopyModalOpen(false)} disabled={loading}>
            <FormattedMessage {...messages.cancelCopy} />
          </BackButton>
          <NextButton id="confirmCopyBtn" onClick={copyPageFunc} loading={loading} disabled={loading}>
            <FormattedMessage {...messages.confirmCopy} />
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
  setRemoveModalOpen: PropTypes.func,
  copyPage: PropTypes.func,
  values: PropTypes.object.isRequired,
  internalConnections: PropTypes.array.isRequired,
  pageTemplates: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  pageUrl: PropTypes.string,
  domain: PropTypes.string,
  pageId: PropTypes.number,
  tagCategories: PropTypes.array.isRequired,
  states: PropTypes.array.isRequired,
  dirty: PropTypes.bool,
};
