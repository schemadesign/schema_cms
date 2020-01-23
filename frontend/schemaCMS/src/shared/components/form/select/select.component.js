import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Icons } from 'schemaUI';

import { Container, IconContainer } from './select.styles';

const { Label, Select: SelectElement } = Form;
const { EditIcon } = Icons;

export class Select extends PureComponent {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    const { label, name, options, onSelect, value, placeholder, ...restProps } = this.props;
    const updatedOptions = options.map(option => ({ ...option, selected: option.value === value }));

    return (
      <Container>
        <Label id="fieldProjectStatusLabel">{label}</Label>
        <input type="hidden" id={name} name={name} value={value} />
        <IconContainer>
          <EditIcon />
        </IconContainer>
        <SelectElement placeholder={placeholder} options={updatedOptions} onSelect={onSelect} {...restProps} />
      </Container>
    );
  }
}
