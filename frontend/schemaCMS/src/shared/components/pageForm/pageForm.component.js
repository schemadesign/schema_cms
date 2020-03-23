import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Icons, Form } from 'schemaUI';
import { map, prepend, pipe, isEmpty } from 'ramda';

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
  PAGE_TEMPLATE_BLOCKS,
} from '../../../modules/page/page.constants';
import { Select } from '../form/select';
import { Modal, ModalActions, modalStyles, ModalTitle } from '../modal/modal.styles';
import { BackButton, NextButton } from '../navigation';

const { EditIcon, MinusIcon } = Icons;
const { Switch } = Form;
const TEMPORARY_PAGE_URL = 'https://schemacms.com';

export const PageForm = ({
  title,
  displayName,
  values,
  handleChange,
  setFieldValue,
  pageTemplates,
  setRemoveModalOpen,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const [changeTemplateModalOpen, setChangeTemplateModalOpen] = useState(false);
  const [temporaryPageTemplate, setTemporaryPageTemplate] = useState(null);
  const pageTemplatesOptions = pipe(
    map(({ name, id }) => ({ value: id, label: name })),
    prepend({ value: null, label: intl.formatMessage(messages.blankTemplate) })
  )(pageTemplates);
  const handleSelectPageTemplate = ({ value }) => {
    const oldValue = values[PAGE_TEMPLATE];

    if (!!oldValue && !isEmpty(values[PAGE_TEMPLATE_BLOCKS]) && oldValue !== value) {
      setTemporaryPageTemplate(value);
      return setChangeTemplateModalOpen(true);
    }
    return setFieldValue(PAGE_TEMPLATE, value);
  };
  const handleConfirmChangeTemplate = () => {
    setChangeTemplateModalOpen(false);
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
        value={values[PAGE_TEMPLATE] || ''}
        id="pageTemplateSelect"
        options={pageTemplatesOptions}
        onSelect={handleSelectPageTemplate}
        placeholder={intl.formatMessage(messages[`${PAGE_TEMPLATE}Placeholder`])}
        {...restFormikProps}
      />
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
  setRemoveModalOpen: PropTypes.func,
  values: PropTypes.object.isRequired,
  pageTemplates: PropTypes.array.isRequired,
  isValid: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
  displayName: PropTypes.string,
};
