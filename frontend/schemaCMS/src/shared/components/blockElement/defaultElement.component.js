import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import { useTheme } from 'styled-components';

import { getCustomInputStyles, customStyles, editIconStyles, InputContainer } from './blockElement.styles';
import { TextInput } from '../form/inputs/textInput';
import { getValuePath } from '../../utils/helpers';

const { EditIcon } = Icons;

export const DefaultElement = ({ element, blockPath, handleChange, index, ...restFormikProps }) => (
  <InputContainer>
    <TextInput
      name={getValuePath({ blockPath, index })}
      value={element.value || ''}
      fullWidth
      customInputStyles={getCustomInputStyles(useTheme())}
      customStyles={customStyles}
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
