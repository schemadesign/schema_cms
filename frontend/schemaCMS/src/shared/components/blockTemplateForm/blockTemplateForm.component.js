import React from 'react';
import { Form, Icons } from 'schemaUI';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { prepend } from 'ramda';

import {
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
  BinIconContainer,
} from '../form/frequentComponents.styles';
import { Container } from './blockTemplateForm.styles';
import messages from './blockTemplateForm.messages';
import { ContextHeader } from '../contextHeader';
import { PlusButton } from '../navigation';
import { TextInput } from '../form/inputs/textInput';
import {
  BLOCK_TEMPLATES_ELEMENTS,
  BLOCK_TEMPLATES_IS_AVAILABLE,
  BLOCK_TEMPLATES_NAME,
  getDefaultBlockElement,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { CounterHeader } from '../counterHeader';
import { BlockTemplateElements } from './blockTemplateElements.component';

const { EditIcon, BinIcon } = Icons;
const { Switch } = Form;

export const BlockTemplateForm = ({
  title,
  handleChange,
  setValues,
  setFieldValue,
  values,
  isValid,
  setRemoveModalOpen = null,
  ...restFormikProps
}) => {
  const intl = useIntl();

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
        autoFocus={!values[BLOCK_TEMPLATES_NAME].length}
        placeholder={intl.formatMessage(messages[`${BLOCK_TEMPLATES_NAME}Placeholder`])}
        {...restFormikProps}
      />
      <IconsContainer>
        <EditIcon />
      </IconsContainer>
    </Subtitle>
  );

  const addElement = () => {
    const elements = prepend(getDefaultBlockElement(), values[BLOCK_TEMPLATES_ELEMENTS]);

    setFieldValue(BLOCK_TEMPLATES_ELEMENTS, elements);
  };

  const elementsCount = values[BLOCK_TEMPLATES_ELEMENTS].length;
  const binIcon = setRemoveModalOpen ? (
    <BinIconContainer id="removeBlock" onClick={() => setRemoveModalOpen(true)}>
      <BinIcon />
    </BinIconContainer>
  ) : null;

  return (
    <Container>
      <ContextHeader title={title} subtitle={nameInput}>
        <PlusButton id="createElement" onClick={addElement} type="button" disabled={!isValid && !!elementsCount} />
      </ContextHeader>
      <MobileInputName>
        <TextInput
          onChange={handleChange}
          name={BLOCK_TEMPLATES_NAME}
          value={values[BLOCK_TEMPLATES_NAME]}
          label={<FormattedMessage {...messages[BLOCK_TEMPLATES_NAME]} />}
          fullWidth
          autoFocus={!values[BLOCK_TEMPLATES_NAME].length}
          {...restFormikProps}
        />
      </MobileInputName>
      <CounterHeader
        moveToTop
        copy={intl.formatMessage(messages.elements)}
        count={elementsCount}
        right={
          <MobilePlusContainer>
            <PlusButton
              customStyles={mobilePlusStyles}
              id="createElement"
              onClick={addElement}
              type="button"
              disabled={!isValid && !!elementsCount}
            />
          </MobilePlusContainer>
        }
      />
      <BlockTemplateElements
        handleChange={handleChange}
        setValues={setValues}
        setFieldValue={setFieldValue}
        isValid={isValid}
        values={values}
        {...restFormikProps}
      />
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
                <FormattedMessage
                  {...messages.availableForEditors}
                  values={{ negative: values[BLOCK_TEMPLATES_IS_AVAILABLE] ? '' : 'un' }}
                />
              </AvailableCopy>
            </SwitchCopy>
          </SwitchContent>
          {binIcon}
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
  isValid: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  title: PropTypes.node.isRequired,
};
