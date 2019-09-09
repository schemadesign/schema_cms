import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'schemaUI';

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
    const { errors, touched, value, onChange, name, ...restProps } = this.props;
    const isError = errors[name] && touched[name];

    return (
      <Container>
        <TextField value={value} onChange={onChange} error={isError} name={name} {...restProps} />
        {this.renderError(isError)}
      </Container>
    );
  }
}
