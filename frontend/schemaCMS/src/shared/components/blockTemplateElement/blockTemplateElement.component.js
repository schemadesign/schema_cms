import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';
import { FormattedMessage, useIntl } from 'react-intl';
import { always, pathOr, cond, T, equals, not, is } from 'ramda';

import {
  customLabelStyles,
  Header,
  IconsContainer,
  InputContainer,
  ElementIcon,
  WarningMessage,
  WarningMessageIcon,
} from './blockTemplateElement.styles';
import messages from './blockTemplateElement.messages';
import { TextInput } from '../form/inputs/textInput';
import {
  BLOCK_TEMPLATES_ELEMENTS,
  CUSTOM_ELEMENT_TYPE,
  ELEMENT_AUTO_OPEN,
  ELEMENT_NAME,
  ELEMENT_TYPE,
  ELEMENTS_TYPES,
  FILE_TYPE,
  IMAGE_TYPE,
} from '../../../modules/blockTemplates/blockTemplates.constants';
import { Select } from '../form/select';
import { renderWhen, renderWhenTrue } from '../../utils/rendering';
import { CustomElement } from './customElement.component';
import { binStyles } from '../form/frequentComponents.styles';

const { EditIcon, BinIcon, MinusIcon, InfoIcon } = Icons;

export const BlockTemplateElement = ({
  element,
  handleChange,
  index,
  setFieldValue,
  removeElement,
  draggableIcon,
  autoFocus,
  ...restFormikProps
}) => {
  const intl = useIntl();
  const [type, setType] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);
  const elementPath = `${BLOCK_TEMPLATES_ELEMENTS}.${index}`;
  const typesOptions = ELEMENTS_TYPES.map(item => ({ label: intl.formatMessage(messages[item]), value: item }));
  const handleSelectType = value => setFieldValue(`${elementPath}.${ELEMENT_TYPE}`, value);
  const renderElements = renderWhenTrue(
    always(
      <CustomElement
        values={pathOr([], ['params', 'elements'], element)}
        valuePath={`${elementPath}.params.elements`}
        {...restFormikProps}
        setFieldValue={setFieldValue}
      />
    )
  );

  useEffect(() => {
    if (type && type.value) {
      const { value } = type;
      const message = cond([
        [equals(FILE_TYPE), always(<FormattedMessage {...messages.warningFile} />)],
        [equals(IMAGE_TYPE), always(<FormattedMessage {...messages.warningImage} />)],
        [T, always(null)],
      ])(value);

      setWarningMessage(message);

      handleSelectType(value);
    }
  }, [type]);

  const renderMessage = renderWhen(is(Object), () => (
    <WarningMessage>
      <WarningMessageIcon>
        <InfoIcon />
      </WarningMessageIcon>
      {warningMessage}
    </WarningMessage>
  ));

  return (
    <AccordionPanel autoOpen={element[ELEMENT_AUTO_OPEN]}>
      <AccordionHeader>
        <Header>
          <IconsContainer>
            {draggableIcon}
            <ElementIcon>
              <MinusIcon />
            </ElementIcon>
          </IconsContainer>
          <TextInput
            name={`${elementPath}.${ELEMENT_NAME}`}
            placeholder={intl.formatMessage(messages.namePlaceholder)}
            onChange={handleChange}
            autoWidth
            fullWidth
            value={element[ELEMENT_NAME]}
            autoFocus={autoFocus && !element[ELEMENT_NAME].length}
            {...restFormikProps}
          />
          <IconsContainer>
            <EditIcon />
            <BinIcon id={`removeElement-${index}`} customStyles={binStyles} onClick={() => removeElement(index)} />
          </IconsContainer>
        </Header>
      </AccordionHeader>
      <AccordionDetails>
        <InputContainer>
          <Select
            label={intl.formatMessage(messages[ELEMENT_TYPE])}
            name={`${elementPath}.${ELEMENT_TYPE}`}
            value={element[ELEMENT_TYPE]}
            id="elementTypeSelect"
            options={typesOptions}
            onSelect={setType}
            placeholder={intl.formatMessage(messages.typePlaceholder)}
            customLabelStyles={customLabelStyles}
            {...restFormikProps}
          />
          {renderMessage(warningMessage)}
        </InputContainer>
        {renderElements(element[ELEMENT_TYPE] === CUSTOM_ELEMENT_TYPE)}
      </AccordionDetails>
    </AccordionPanel>
  );
};

BlockTemplateElement.propTypes = {
  element: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  removeElement: PropTypes.func.isRequired,
  draggableIcon: PropTypes.element.isRequired,
  autoFocus: PropTypes.bool.isRequired,
};
