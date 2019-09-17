import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { equals, ifElse } from 'ramda';

import { buttonStyles, containerStyles, inputStyles, labelStyles } from './fileUpload.styles';
import { containerStyles as defaultButtonStyles } from '../../button/button.styles';
import { UploadIcon } from '../../icons/uploadIcon';
import { TextField } from '../textField';

const DEFAULT_TEXT_VALUE = 'Select a file';

export class FileUpload extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    fileName: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    accept: PropTypes.string,
    onChange: PropTypes.func,
    customStyles: PropTypes.object,
    customInputStyles: PropTypes.object,
    customLabelStyles: PropTypes.object,
    iconComponent: PropTypes.element,
  };

  static defaultProps = {
    customStyles: {},
    customInputStyles: {},
    customLabelStyles: {},
    iconComponent: (
      <div style={{ ...defaultButtonStyles, ...buttonStyles }}>
        <UploadIcon />
      </div>
    ),
  };

  iconComponent = id => (
    <label style={labelStyles} htmlFor={id}>
      {this.props.iconComponent}
    </label>
  );

  renderTextField = () => {
    const { fileName, label, id, customStyles, customLabelStyles, customInputStyles } = this.props;

    return ifElse(
      equals(true),
      () => (
        <TextField
          name="fileName"
          label={label}
          value={fileName || DEFAULT_TEXT_VALUE}
          fullWidth
          disabled
          customStyles={customStyles}
          customLabelStyles={customLabelStyles}
          customInputStyles={customInputStyles}
          iconComponent={this.iconComponent(id)}
        />
      ),
      () => this.iconComponent(id)
    )(!!label);
  };

  render() {
    const { onChange, accept, id } = this.props;

    return (
      <div style={containerStyles}>
        {this.renderTextField()}
        <input style={inputStyles} aria-hidden id={id} type="file" onChange={onChange} accept={accept} />
      </div>
    );
  }
}
