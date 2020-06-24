import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'schemaUI';

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
    isRemovable: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    errors: {},
    touched: {},
    checkOnlyErrors: false,
    isRemovable: false,
  };

  renderError = renderWhenTrue(() => <ErrorWrapper>{this.props.errors[this.props.name]}</ErrorWrapper>);

  render() {
    const { errors, touched, checkOnlyErrors, fileNames, label, id, onChange, isRemovable, ...restProps } = this.props;
    const isError = !!errors[restProps.name];
    const isTouched = touched[restProps.name];
    const error = checkOnlyErrors ? isError : isError && isTouched;

    return (
      <Container>
        <FileUpload
          fileNames={fileNames}
          label={label}
          id={id}
          onChange={onChange}
          isRemovable={isRemovable}
          {...restProps}
        />
        <DropZone inputId={id} onChange={onChange} {...restProps} hidden />
        {this.renderError(error)}
      </Container>
    );
  }
}
