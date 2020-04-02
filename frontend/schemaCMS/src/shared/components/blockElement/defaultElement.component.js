import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'schemaUI';
import { useTheme } from 'styled-components';

import { getCustomInputStyles, editIconStyles, InputContainer } from './blockElement.styles';
import { TextInput } from '../form/inputs/textInput';

const { EditIcon } = Icons;

export const DefaultElement = ({ element, formikFieldPath, handleChange, ...restFormikProps }) => (
  <InputContainer>
    <TextInput
      name={formikFieldPath}
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
  formikFieldPath: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};
