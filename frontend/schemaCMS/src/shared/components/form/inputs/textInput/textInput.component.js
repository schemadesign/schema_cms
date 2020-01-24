import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Icons } from 'schemaUI';
import { always } from 'ramda';

import { Container, ErrorWrapper, IconWrapper } from './textInput.styles';
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
    isEdit: PropTypes.bool,
    handleBlur: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    errors: {},
    touched: {},
    checkOnlyErrors: false,
    isEdit: false,
    onChange: Function.prototype,
  };

  renderError = renderWhenTrue(() => <ErrorWrapper>{this.props.errors[this.props.name]}</ErrorWrapper>);

  renderEditIcon = renderWhenTrue(
    always(
      <IconWrapper>
        <Icons.EditIcon />
      </IconWrapper>
    )
  );

  render() {
    const {
      errors,
      touched,
      onChange,
      handleBlur,
      label,
      multiline,
      customStyles,
      customInputStyles,
      fullWidth,
      checkOnlyErrors,
      readOnly,
      isEdit,
      ...restProps
    } = this.props;
    const isError = !!errors[restProps.name];
    const isTouched = touched[restProps.name];
    const error = checkOnlyErrors ? isError : isError && isTouched;

    return (
      <Container>
        <TextField
          label={label}
          onChange={onChange}
          onBlur={handleBlur}
          error={error}
          multiline={multiline}
          customStyles={customStyles}
          customInputStyles={customInputStyles}
          fullWidth={fullWidth}
          readOnly={readOnly}
          iconComponent={this.renderEditIcon(isEdit)}
          {...restProps}
        />
        {this.renderError(error)}
      </Container>
    );
  }
}
