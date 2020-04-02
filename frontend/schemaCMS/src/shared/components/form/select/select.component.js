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
    onSelect,
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
        <IconContainer>
          <CaretIcon />
        </IconContainer>
        <SelectElement
          placeholder={placeholder}
          options={updatedOptions}
          onSelect={onSelect}
          open={open}
          setOpen={setOpen}
          {...restProps}
        />
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
  onSelect: PropTypes.func.isRequired,
};
