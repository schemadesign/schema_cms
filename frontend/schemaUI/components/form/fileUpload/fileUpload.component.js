import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { buttonStyles, containerStyles, getLabelStyles, inputStyles } from './fileUpload.styles';
import { getStyles } from '../../button/button.styles';
import { UploadIcon } from '../../icons/uploadIcon';
import { TextField } from '../textField';
import { withStyles } from '../../styles/withStyles';

const DEFAULT_TEXT_VALUE = 'Select a file';

export class FileUploadComponent extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    fileNames: PropTypes.array,
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
  };

  state = {
    iconComponent: this.props.iconComponent || (
      <div style={{ ...getStyles(this.props.theme).containerStyles, ...buttonStyles }}>
        <UploadIcon />
      </div>
    ),
  };

  iconComponent = ({ id, label }) => (
    <label style={getLabelStyles(label)} htmlFor={id}>
      {this.state.iconComponent}
    </label>
  );

  renderTextField = ({ fileNames = [], label, id, customStyles, customLabelStyles, customInputStyles }) => (
    <TextField
      name="fileNames"
      label={label}
      value={fileNames.length ? fileNames : DEFAULT_TEXT_VALUE}
      fullWidth
      disabled
      customStyles={customStyles}
      customLabelStyles={customLabelStyles}
      customInputStyles={customInputStyles}
      iconComponent={this.iconComponent({ id, label })}
    />
  );

  renderContent = data => (data.label ? this.renderTextField(data) : this.iconComponent(data));

  render() {
    const {
      id,
      fileNames,
      label,
      customStyles,
      customLabelStyles,
      customInputStyles,
      iconComponent,
      multiple,
      ...props
    } = this.props;

    return (
      <div style={containerStyles}>
        {this.renderContent({
          fileNames,
          label,
          id,
          customStyles,
          customLabelStyles,
          customInputStyles,
          multiple,
        })}
        <input style={inputStyles} aria-hidden id={id} multiple={multiple} type="file" {...props} />
      </div>
    );
  }
}

export const FileUpload = withStyles(FileUploadComponent);
