import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'schemaUI';

import { Container } from './select.styles';

const { Label, Select: SelectElement } = Form;

export class Select extends PureComponent {
  static propTypes = {
    defaultOption: PropTypes.object,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    const { defaultOption, label, name, options, onSelect, value } = this.props;
    const updatedOptions = options.map(option => ({ ...option, selected: option.value === value }));

    return (
      <Container>
        <Label>{label}</Label>
        <input type="hidden" id={name} name={name} value={value} />
        <SelectElement defaultOption={defaultOption} options={updatedOptions} onSelect={onSelect} />
      </Container>
    );
  }
}
