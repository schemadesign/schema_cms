import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  getButtonStyles,
  iconContainerStyles,
  getLabelStyles,
  inputStyles,
  getValueStyles,
  containerStyles,
} from './fileUpload.styles';
import { getStyles } from '../../button/button.styles';
import { UploadIcon } from '../../icons/uploadIcon';
import { withStyles } from '../../styles/withStyles';
import { Label } from '../label';
import { BUTTON } from '../../button/button.constants';
import { filterAllowedAttributes } from '../../../utils/helpers';

const DEFAULT_TEXT_VALUE = 'Select a file';

export class FileUploadComponent extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    fileNames: PropTypes.array,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    id: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    accept: PropTypes.string,
    onChange: PropTypes.func,
    customStyles: PropTypes.object,
    customInputStyles: PropTypes.object,
    customLabelStyles: PropTypes.object,
    customIconContainerStyles: PropTypes.object,
    iconComponent: PropTypes.element,
  };

  static defaultProps = {
    disabled: false,
    customStyles: {},
    customInputStyles: {},
    customLabelStyles: {},
  };

  state = {
    iconComponent: this.props.iconComponent || (
      <div
        style={{
          ...getStyles(this.props.theme, BUTTON, this.props.disabled).containerStyles,
          ...getButtonStyles(this.props.disabled),
        }}
      >
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
    disabled,
  }) => (
    <Fragment>
      <Label htmlFor={id} customStyles={customLabelStyles}>
        {label}
      </Label>
      <label htmlFor={id} style={{ ...getValueStyles(disabled), ...customInputStyles }}>
        {(fileNames.length && fileNames) || placeholder || DEFAULT_TEXT_VALUE}
      </label>
      <div style={{ ...iconContainerStyles, ...customIconContainerStyles }}>
        {this.iconComponent({ id, label, disabled })}
      </div>
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
      disabled,
      ...restProps
    } = this.props;
    const filteredProps = filterAllowedAttributes('input', restProps);

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
          disabled,
        })}
        <input style={inputStyles} aria-hidden id={id} multiple={multiple} type="file" disabled={disabled} {...filteredProps} />
      </div>
    );
  }
}

export const FileUpload = withStyles(FileUploadComponent);
