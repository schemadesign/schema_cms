import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Icons } from 'schemaUI';
import { always } from 'ramda';

import { Container, IconContainer } from './select.styles';
import { renderWhenTrue } from '../../../utils/rendering';

const { Label, Select: SelectElement } = Form;
const { CaretIcon } = Icons;

export class Select extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.array,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    placeholder: PropTypes.string,
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    label: null,
    customStyles: null,
  };

  renderLabel = renderWhenTrue(always(<Label id="fieldProjectStatusLabel">{this.props.label}</Label>));

  render() {
    const { label, name, options, onSelect, value, placeholder, customStyles, ...restProps } = this.props;
    const updatedOptions = options.map(option => ({ ...option, selected: option.value === value }));

    return (
      <Container customStyles={customStyles}>
        {this.renderLabel(!!label)}
        <input type="hidden" id={name} name={name} value={value} />
        <IconContainer>
          <CaretIcon />
        </IconContainer>
        <SelectElement placeholder={placeholder} options={updatedOptions} onSelect={onSelect} {...restProps} />
      </Container>
    );
  }
}
