import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Icons } from 'schemaUI';
import { pick } from 'ramda';
import elementAttributes from 'html-element-attributes/index.json';

import { Container, IconContainer } from './select.styles';

const { Label, Select: SelectElement } = Form;
const { EditIcon } = Icons;

export class Select extends PureComponent {
  static propTypes = {
    defaultOption: PropTypes.object,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    const { defaultOption, label, name, options, onSelect, value, ...restProps } = this.props;
    const updatedOptions = options.map(option => ({ ...option, selected: option.value === value }));
    const allowedAttributes = [...elementAttributes['*'], ...elementAttributes.select];

    const filteredProps = pick(allowedAttributes, restProps);

    return (
      <Container>
        <Label id="fieldProjectStatusLabel">{label}</Label>
        <input type="hidden" id={name} name={name} value={value} />
        <IconContainer>
          <EditIcon />
        </IconContainer>
        <SelectElement defaultOption={defaultOption} options={updatedOptions} onSelect={onSelect} {...filteredProps} />
      </Container>
    );
  }
}
