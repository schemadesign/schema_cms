import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { cond, propIs, T, propEq, isEmpty } from 'ramda';

import {
  buttonStyles,
  containerStyles,
  getLabelStyles,
  iconContainerStyles,
  inputStyles,
  itemContainerStyles,
  itemStyles,
  listContainerStyles,
  removeIconStyles,
} from './fileUpload.styles';
import { getStyles } from '../../button/button.styles';
import { UploadIcon } from '../../icons/uploadIcon';
import { TextField } from '../textField';
import { withStyles } from '../../styles/withStyles';
import { Label } from '../label';
import { CloseIcon } from '../../icons/closeIcon';

const DEFAULT_TEXT_VALUE = 'Select a file';

export class FileUploadComponent extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    fileNames: PropTypes.array,
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    accept: PropTypes.string,
    onChange: PropTypes.func,
    onRemoveItem: PropTypes.func,
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

  renderItem = ({ name, onRemoveItem, index }) => (
    <div key={index} style={itemStyles}>
      {name}
      {onRemoveItem ? <CloseIcon customStyles={removeIconStyles} onClick={() => onRemoveItem(name)} /> : null}
    </div>
  );

  renderList = ({ fileNames = [], label, id, onRemoveItem }) => (
    <div style={listContainerStyles}>
      <Label>{label}</Label>
      <div style={itemContainerStyles}>
        {isEmpty(fileNames)
          ? DEFAULT_TEXT_VALUE
          : fileNames.map((name, index) => this.renderItem({ name, onRemoveItem, index }))}
      </div>
      <div style={iconContainerStyles}>{this.iconComponent({ id, label })}</div>
    </div>
  );

  renderTextField = ({ fileNames = [], label, id, customStyles, customLabelStyles, customInputStyles }) => (
    <TextField
      name="fileNames"
      label={label}
      value={fileNames[0] || DEFAULT_TEXT_VALUE}
      fullWidth
      disabled
      customStyles={customStyles}
      customLabelStyles={customLabelStyles}
      customInputStyles={customInputStyles}
      iconComponent={this.iconComponent({ id, label })}
    />
  );

  renderContent = cond([
    [propEq('multiple', true), this.renderList],
    [propIs(String, 'label'), this.renderTextField],
    [T, ({ label, id }) => this.iconComponent({ id, label })],
  ]);

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
      onRemoveItem,
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
          onRemoveItem,
        })}
        <input style={inputStyles} aria-hidden id={id} multiple={multiple} type="file" {...props} />
      </div>
    );
  }
}

export const FileUpload = withStyles(FileUploadComponent);
