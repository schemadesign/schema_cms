import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { buttonStyles, containerStyles, customInputStyles, inputStyles, labelStyles } from './fileUpload.styles';
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
  };

  render() {
    const { name, label, onChange, accept, id } = this.props;

    return (
      <div style={containerStyles}>
        <TextField
          name="fileName"
          label={label}
          value={name || 'Select a file'}
          fullWidth
          disabled
          customInputStyles={customInputStyles}
          iconComponent={
            <label style={labelStyles} htmlFor={id}>
              <div style={{ ...defaultButtonStyles, ...buttonStyles }}>
                <UploadIcon />
              </div>
            </label>
          }
        />
        <input style={inputStyles} aria-hidden id={id} type="file" onChange={onChange} accept={accept} />
      </div>
    );
  }
}
