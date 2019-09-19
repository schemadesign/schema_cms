import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { find, propEq } from 'ramda';
import { Form } from 'schemaUI';

import { Container } from './select.styles';

const { Label, Select: SelectElement } = Form;

export class Select extends PureComponent {
  static propTypes = {
    defaultOption: PropTypes.object,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    const { defaultOption, label, name, options, onChange, onSelect } = this.props;
    const { value = '' } = find(propEq('selected', true))(options) || {};

    return (
      <Container>
        <Label>{label}</Label>
        <input hidden name={name} value={value} onChange={onChange} />
        <SelectElement defaultOption={defaultOption} options={options} onSelect={onSelect} />
      </Container>
    );
  }
}
