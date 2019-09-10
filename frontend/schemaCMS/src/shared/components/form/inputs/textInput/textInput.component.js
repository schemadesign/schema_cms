import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'schemaUI';
import { pick } from 'ramda';
import elementAttributes from 'html-element-attributes/index.json';

import { Container, ErrorWrapper } from './textInput.styles';
import { renderWhenTrue } from '../../../../utils/rendering';

const { TextField } = Form;

export class TextInput extends PureComponent {
  static propTypes = {
    errors: PropTypes.object,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    touched: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    errors: {},
    touched: {},
  };

  renderError = renderWhenTrue(() => <ErrorWrapper>{this.props.errors[this.props.name]}</ErrorWrapper>);

  render() {
    const { errors, touched, onChange, label, ...restProps } = this.props;
    const filteredProps = pick(elementAttributes.input, restProps);

    const isError = errors[filteredProps.name] && touched[filteredProps.name];

    return (
      <Container>
        <TextField label={label} onChange={onChange} error={isError} {...filteredProps} />
        {this.renderError(isError)}
      </Container>
    );
  }
}
