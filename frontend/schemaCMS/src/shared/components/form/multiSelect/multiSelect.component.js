import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import { useTheme } from 'styled-components';

import { Container, getCustomSelectStyles } from './multiSelect.styles';

const DropdownIndicator = ({ selectProps, ...restProps }) => {
  return (
    <components.DropdownIndicator {...restProps}>
      {selectProps.value.length}/{selectProps.limit}
    </components.DropdownIndicator>
  );
};

DropdownIndicator.propTypes = {
  selectProps: PropTypes.object.isRequired,
};

export const MultiSelect = ({ limit, options, value, onChange, closeMenuOnSelect = false }) => {
  const theme = useTheme();
  const customStyles = getCustomSelectStyles(theme);

  return (
    <Container>
      <Select
        closeMenuOnSelect={closeMenuOnSelect}
        components={{ DropdownIndicator }}
        styles={customStyles}
        value={value}
        onChange={onChange}
        options={options}
        isMulti
        limit={limit || options.length}
      />
    </Container>
  );
};

MultiSelect.propTypes = {
  closeMenuOnSelect: PropTypes.bool,
  limit: PropTypes.number,
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};
