import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Form, Icons } from 'schemaUI';
import { always } from 'ramda';

import { Container, IconContainer } from './select.styles';
import { renderWhenTrue } from '../../../utils/rendering';

const { Label, Select: SelectElement } = Form;
const { CaretIcon } = Icons;

export const Select = memo(
  ({
    customStyles = null,
    customLabelStyles = {},
    label = null,
    name,
    value,
    placeholder,
    options,
    centerIcon = false,
    onSelect,
    iconContainerStyles,
    ...restProps
  }) => {
    const [open, setOpen] = useState(false);
    const labelComponent = renderWhenTrue(
      always(
        <Label id="fieldProjectStatusLabel" customStyles={customLabelStyles}>
          {label}
        </Label>
      )
    )(!!label);
    const updatedOptions = options.map(option => ({ ...option, selected: option.value === value }));

    return (
      <Container customStyles={customStyles} onClick={() => setOpen(!open)}>
        {labelComponent}
        <input type="hidden" id={name} name={name} value={value} />
        <SelectElement
          placeholder={placeholder}
          options={updatedOptions}
          onSelect={onSelect}
          open={open}
          setOpen={setOpen}
          {...restProps}
        />
        <IconContainer style={iconContainerStyles} centerIcon={centerIcon}>
          <CaretIcon />
        </IconContainer>
      </Container>
    );
  }
);

Select.propTypes = {
  customStyles: PropTypes.array,
  customLabelStyles: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placeholder: PropTypes.string,
  options: PropTypes.array.isRequired,
  centerIcon: PropTypes.bool,
  iconContainerStyles: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
};
