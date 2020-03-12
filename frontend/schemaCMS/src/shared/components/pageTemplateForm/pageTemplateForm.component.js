import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form, Icons } from 'schemaUI';
import { prepend } from 'ramda';

import { Container } from './pageTemplateForm.styles';
import { ContextHeader } from '../contextHeader';
import { PlusButton } from '../navigation';
import {
  AvailableCopy,
  BinIconContainer,
  binStyles,
  IconsContainer,
  inputContainerStyles,
  inputStyles,
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
  getDefaultPageBlock,
  PAGE_TEMPLATES_ALLOW_ADD,
  PAGE_TEMPLATES_BLOCKS,
  PAGE_TEMPLATES_IS_AVAILABLE,
  PAGE_TEMPLATES_NAME,
} from '../../../modules/pageTemplates/pageTemplates.constants';
import { CounterHeader } from '../counterHeader';

const { EditIcon, MinusIcon } = Icons;
const { Switch } = Form;

export const PageTemplateForm = ({
  handleChange,
  title,
  values,
  setFieldValue,
  setRemoveModalOpen,
  isValid,
  ...restFormikProps
}) => {
  const intl = useIntl();

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
        <EditIcon />
      </IconsContainer>
    </Subtitle>
  );
  const addBlock = () => {
    const blocks = prepend(getDefaultPageBlock(), values[PAGE_TEMPLATES_BLOCKS]);

    setFieldValue(PAGE_TEMPLATES_BLOCKS, blocks);
  };
  const binIcon = setRemoveModalOpen ? (
    <BinIconContainer id="removePage" onClick={() => setRemoveModalOpen(true)}>
      <MinusIcon customStyles={binStyles} />
    </BinIconContainer>
  ) : null;
  const blocksCount = values[PAGE_TEMPLATES_BLOCKS].length;

  return (
    <Container>
      <ContextHeader title={title} subtitle={nameInput}>
        <PlusButton id="createBlock" onClick={addBlock} type="button" disabled={!isValid} />
      </ContextHeader>
      <MobileInputName>
        <TextInput
          onChange={handleChange}
          name={PAGE_TEMPLATES_NAME}
          value={values[PAGE_TEMPLATES_NAME]}
          label={<FormattedMessage {...messages[PAGE_TEMPLATES_NAME]} />}
          fullWidth
          autoFocus={!values[PAGE_TEMPLATES_NAME].length}
          {...restFormikProps}
        />
      </MobileInputName>
      <CounterHeader
        copy={intl.formatMessage(messages.blocks)}
        count={blocksCount}
        right={
          <MobilePlusContainer>
            <PlusButton customStyles={mobilePlusStyles} id="createBlock" onClick={addBlock} type="button" />
          </MobilePlusContainer>
        }
      />
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
          <Switch value={values[PAGE_TEMPLATES_ALLOW_ADD]} id={PAGE_TEMPLATES_ALLOW_ADD} onChange={handleChange} />
          <SwitchCopy>
            <SwitchLabel htmlFor={PAGE_TEMPLATES_ALLOW_ADD}>
              <FormattedMessage {...messages[PAGE_TEMPLATES_ALLOW_ADD]} />
            </SwitchLabel>
          </SwitchCopy>
        </SwitchContainer>
      </Switches>
    </Container>
  );
};

PageTemplateForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setRemoveModalOpen: PropTypes.func,
  values: PropTypes.object.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  isValid: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
};
