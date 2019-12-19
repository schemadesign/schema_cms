import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  buttonStyles,
  iconContainerStyles,
  getLabelStyles,
  inputStyles,
  valueStyles,
  containerStyles,
} from './fileUpload.styles';
import { getStyles } from '../../button/button.styles';
import { UploadIcon } from '../../icons/uploadIcon';
import { withStyles } from '../../styles/withStyles';
import { Label } from '../label';

const DEFAULT_TEXT_VALUE = 'Select a file';

export class FileUploadComponent extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    fileNames: PropTypes.array,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    id: PropTypes.string.isRequired,
    accept: PropTypes.string,
    onChange: PropTypes.func,
    customStyles: PropTypes.object,
    customInputStyles: PropTypes.object,
    customLabelStyles: PropTypes.object,
    customIconContainerStyles: PropTypes.object,
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

  renderTextField = ({
    fileNames = [],
    label,
    id,
    customLabelStyles,
    customInputStyles,
    customIconContainerStyles,
    placeholder,
  }) => (
    <Fragment>
      <Label htmlFor={id} customStyles={customLabelStyles}>
        {label}
      </Label>
      <label htmlFor={id} style={{ ...valueStyles, ...customInputStyles }}>
        {(fileNames.length && fileNames) || placeholder || DEFAULT_TEXT_VALUE}
      </label>
      <div style={{ ...iconContainerStyles, ...customIconContainerStyles }}>{this.iconComponent({ id, label })}</div>
    </Fragment>
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
      customIconContainerStyles,
      iconComponent,
      multiple,
      placeholder,
      ...props
    } = this.props;

    return (
      <div style={{ ...containerStyles, ...customStyles }}>
        {this.renderContent({
          fileNames,
          label,
          id,
          customStyles,
          customLabelStyles,
          customInputStyles,
          customIconContainerStyles,
          multiple,
          placeholder,
        })}
        <input style={inputStyles} aria-hidden id={id} multiple={multiple} type="file" {...props} />
      </div>
    );
  }
}

export const FileUpload = withStyles(FileUploadComponent);
