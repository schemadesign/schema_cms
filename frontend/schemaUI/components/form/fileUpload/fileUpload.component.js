import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { buttonStyles, containerStyles, inputStyles, labelStyles } from './fileUpload.styles';
import { containerStyles as defaultButtonStyles } from '../../button/button.styles';
import { UploadIcon } from '../../icons/uploadIcon';
import { TextField } from '../textField';

export class FileUpload extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
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

  render() {
    const {
      name,
      label,
      id,
      customInputStyles,
      customLabelStyles,
      customStyles,
      iconComponent,
      ...restProps
    } = this.props;

    return (
      <div style={containerStyles}>
        <TextField
          name="fileName"
          label={label}
          value={name || 'Select a file'}
          fullWidth
          disabled
          customStyles={customStyles}
          customLabelStyles={customLabelStyles}
          customInputStyles={customInputStyles}
          iconComponent={this.iconComponent(id)}
        />
        <input style={inputStyles} aria-hidden id={id} type="file" {...restProps} />
      </div>
    );
  }
}
