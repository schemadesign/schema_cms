import React from 'react';
import PropTypes from 'prop-types';
import { cond, pathEq, pathOr, T } from 'ramda';
import { AccordionDetails, AccordionHeader, AccordionPanel, Icons } from 'schemaUI';
import { useTheme } from 'styled-components';
import { useIntl } from 'react-intl';

import {
  DetailsContainer,
  Header,
  Name,
  IconContainer,
  getCustomInputStyles,
  editIconStyles,
  InputContainer,
} from './blockElement.styles';
import messages from './blockElement.messages';
import { ELEMENT_VALUE, IMAGE_TYPE, STACK_TYPE } from '../../../modules/blockTemplates/blockTemplates.constants';
import { TextInput } from '../form/inputs/textInput';
import { BLOCK_ELEMENTS } from '../../../modules/page/page.constants';
import { Uploader } from '../form/uploader';
import { getEventFiles } from '../../utils/helpers';

const { MinusIcon, EditIcon } = Icons;

const elementPropTypes = {
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export const ImageElement = ({ blockPath, index, element, ...restFormikProps }) => {
  const name = `${blockPath}.${BLOCK_ELEMENTS}.${index}.${ELEMENT_VALUE}`;
  const intl = useIntl();
  const handleUploadChange = data => {
    const { setFieldValue } = restFormikProps;
    const uploadFile = getEventFiles(data);
    if (!uploadFile.length) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(uploadFile[0]);

    reader.addEventListener(
      'load',
      ({ target: { result } }) => {
        setFieldValue(`${name}.file`, result);
        setFieldValue(`${name}.fileName`, pathOr('', ['name'], uploadFile[0]));
      },
      false
    );
  };

  return (
    <Uploader
      name={name}
      id={name}
      fileNames={pathOr('', ['value', 'fileName'], element)}
      onChange={handleUploadChange}
      accept=".png, .jpg, .jpeg, .gif"
      label={intl.formatMessage(messages.image)}
      placeholder={intl.formatMessage(messages.imagePlaceholder)}
      {...restFormikProps}
    />
  );
};
ImageElement.propTypes = elementPropTypes;

export const BlockStackElement = ({ element }) => element.type;
BlockStackElement.propTypes = elementPropTypes;

export const DefaultElement = ({ element, blockPath, index, handleChange, ...restFormikProps }) => (
  <InputContainer>
    <TextInput
      name={`${blockPath}.${BLOCK_ELEMENTS}.${index}.${ELEMENT_VALUE}`}
      value={element.value || ''}
      fullWidth
      customInputStyles={getCustomInputStyles(useTheme())}
      onChange={handleChange}
      multiline
      {...restFormikProps}
    />
    <EditIcon customStyles={editIconStyles} />
  </InputContainer>
);
DefaultElement.propTypes = elementPropTypes;

export const BlockElement = props => {
  const elementComponent = cond([
    [pathEq(['element', 'type'], IMAGE_TYPE), ImageElement],
    [pathEq(['element', 'type'], STACK_TYPE), BlockStackElement],
    [T, DefaultElement],
  ])(props);
  const { element } = props;

  return (
    <AccordionPanel>
      <AccordionHeader>
        <Header>
          <IconContainer>
            <MinusIcon />
          </IconContainer>
          <Name>{element.name}</Name>
        </Header>
      </AccordionHeader>
      <AccordionDetails>
        <DetailsContainer>{elementComponent}</DetailsContainer>
      </AccordionDetails>
    </AccordionPanel>
  );
};

BlockElement.propTypes = {
  element: PropTypes.object.isRequired,
};
