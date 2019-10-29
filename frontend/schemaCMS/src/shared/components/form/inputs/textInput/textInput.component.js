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
    customStyles: PropTypes.object,
    customInputStyles: PropTypes.object,
    errors: PropTypes.object,
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    checkOnlyErrors: PropTypes.bool,
    multiline: PropTypes.bool,
    fullWidth: PropTypes.bool,
    name: PropTypes.string.isRequired,
    touched: PropTypes.object,
    value: PropTypes.string,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    errors: {},
    touched: {},
    checkOnlyErrors: false,
    onChange: Function.prototype,
  };

  renderError = renderWhenTrue(() => <ErrorWrapper>{this.props.errors[this.props.name]}</ErrorWrapper>);

  render() {
    const {
      errors,
      touched,
      onChange,
      label,
      multiline,
      customStyles,
      customInputStyles,
      fullWidth,
      checkOnlyErrors,
      readOnly,
      ...restProps
    } = this.props;
    const allowedAttributes = [...elementAttributes['*'], ...elementAttributes.input];
    const filteredProps = pick(allowedAttributes, restProps);
    const isError = !!errors[filteredProps.name];
    const isTouched = touched[filteredProps.name];
    const error = checkOnlyErrors ? isError : isError && isTouched;

    return (
      <Container>
        <TextField
          label={label}
          onChange={onChange}
          error={error}
          multiline={multiline}
          customStyles={customStyles}
          customInputStyles={customInputStyles}
          fullWidth={fullWidth}
          readOnly={readOnly}
          {...filteredProps}
        />
        {this.renderError(error)}
      </Container>
    );
  }
}
