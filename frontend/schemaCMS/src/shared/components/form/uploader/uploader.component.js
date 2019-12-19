import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'schemaUI';
import { pick } from 'ramda';
import elementAttributes from 'html-element-attributes/index.json';

import { Container, ErrorWrapper } from './uploader.styles';
import { renderWhenTrue } from '../../../utils/rendering';

const { FileUpload, DropZone } = Form;

export class Uploader extends PureComponent {
  static propTypes = {
    fileNames: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    placeholder: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    errors: PropTypes.object,
    touched: PropTypes.object,
    checkOnlyErrors: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    errors: {},
    touched: {},
    checkOnlyErrors: false,
  };

  renderError = renderWhenTrue(() => <ErrorWrapper>{this.props.errors[this.props.name]}</ErrorWrapper>);

  render() {
    const allowedAttributes = [...elementAttributes['*'], ...elementAttributes.input];
    const { errors, touched, checkOnlyErrors, fileNames, label, id, onChange, ...restProps } = this.props;
    const filteredProps = pick(allowedAttributes, restProps);
    const isError = !!errors[filteredProps.name];
    const isTouched = touched[filteredProps.name];
    const error = checkOnlyErrors ? isError : isError && isTouched;

    return (
      <Container>
        <FileUpload fileNames={fileNames} label={label} id={id} onChange={onChange} {...filteredProps} />
        <DropZone inputId={id} onChange={onChange} {...filteredProps} hidden />
        {this.renderError(error)}
      </Container>
    );
  }
}
