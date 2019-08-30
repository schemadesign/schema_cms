import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'schemaUI';

import { Container, ErrorWrapper } from './textInput.styles';
import { renderWhenTrue } from '../../../../utils/rendering';

const { TextField } = Form;

export class TextInput extends PureComponent {
  static propTypes = {
    touched: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    value: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  renderError = renderWhenTrue(() => <ErrorWrapper>{this.props.errors[this.props.name]}</ErrorWrapper>);

  render() {
    const { errors, touched, value, onChange, name } = this.props;
    const isError = errors[name] && touched[name];

    return (
      <Container>
        <TextField value={value} onChange={onChange} error={isError} name={name} />
        {this.renderError(isError)}
      </Container>
    );
  }
}
