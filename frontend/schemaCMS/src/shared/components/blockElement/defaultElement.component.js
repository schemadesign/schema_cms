import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import { useTheme } from 'styled-components';

import { getCustomInputStyles, editIconStyles, InputContainer } from './blockElement.styles';
import { ELEMENT_VALUE } from '../../../modules/blockTemplates/blockTemplates.constants';
import { TextInput } from '../form/inputs/textInput';
import { BLOCK_ELEMENTS } from '../../../modules/page/page.constants';

const { EditIcon } = Icons;

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
DefaultElement.propTypes = {
  element: PropTypes.object.isRequired,
  blockPath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
