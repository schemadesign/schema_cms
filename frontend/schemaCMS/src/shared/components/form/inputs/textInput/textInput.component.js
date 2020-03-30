import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Icons } from 'schemaUI';
import { always, path, pathOr, split } from 'ramda';

import { Container, ErrorWrapper, getIconStyles, IconWrapper } from './textInput.styles';
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
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    readOnly: PropTypes.bool,
    isEdit: PropTypes.bool,
    autoWidth: PropTypes.bool,
    handleBlur: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    errors: {},
    touched: {},
    checkOnlyErrors: false,
    isEdit: false,
    autoWidth: false,
    onChange: Function.prototype,
  };

  renderError = ({ error, errorMessage }) =>
    renderWhenTrue(() => (
      <ErrorWrapper isLabel={!!this.props.label} isAuthWidth={this.props.autoWidth}>
        {errorMessage}
      </ErrorWrapper>
    ))(error);

  renderEditIcon = renderWhenTrue(
    always(
      <IconWrapper isLabel={!!this.props.label}>
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
      autoWidth,
      ...restProps
    } = this.props;
    const errorMessage = path(split('.', restProps.name), errors);
    const isError = !!errorMessage;
    const isTouched = pathOr(false, split('.', restProps.name), touched);
    const error = checkOnlyErrors ? isError : isError && isTouched;

    return (
      <Container isAuthWidth={this.props.autoWidth}>
        <TextField
          label={label}
          onChange={onChange}
          onBlur={handleBlur}
          error={error}
          multiline={multiline}
          customStyles={customStyles}
          customInputStyles={customInputStyles}
          customIconStyles={getIconStyles(!!label || autoWidth)}
          autoWidth={autoWidth}
          fullWidth={fullWidth}
          readOnly={readOnly}
          iconComponent={this.renderEditIcon(isEdit)}
          {...restProps}
        />
        {this.renderError({ error, errorMessage })}
      </Container>
    );
  }
}
