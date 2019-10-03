import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'schemaUI';
import { pick } from 'ramda';
import elementAttributes from 'html-element-attributes/index.json';

import { Container, ErrorWrapper } from './uploader.styles';
import { renderWhenTrue } from '../../../utils/rendering';

const { FileUpload } = Form;

export class Uploader extends PureComponent {
  static propTypes = {
    fileName: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    errors: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    errors: {},
  };

  renderError = renderWhenTrue(() => <ErrorWrapper>{this.props.errors[this.props.name]}</ErrorWrapper>);

  render() {
    const { errors, fileName, label, id, onChange, ...restProps } = this.props;
    const filteredProps = pick(elementAttributes.input, restProps);
    const isError = !!errors[filteredProps.name];

    return (
      <Container>
        <FileUpload fileName={fileName} label={label} id={id} onChange={onChange} {...filteredProps} />
        {this.renderError(isError)}
      </Container>
    );
  }
}
