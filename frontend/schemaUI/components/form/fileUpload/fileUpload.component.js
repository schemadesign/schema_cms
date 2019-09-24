import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { equals, ifElse } from 'ramda';

import { buttonStyles, containerStyles, getLabelStyles, inputStyles } from './fileUpload.styles';
import { getStyles } from '../../button/button.styles';
import { UploadIcon } from '../../icons/uploadIcon';
import { TextField } from '../textField';
import { dark } from '../../../utils/theme';

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
      <div style={{ ...getStyles(dark).containerStyles, ...buttonStyles }}>
        <UploadIcon />
      </div>
    ),
  };

  iconComponent = ({ id, label }) => (
    <label style={getLabelStyles(label)} htmlFor={id}>
      {this.props.iconComponent}
    </label>
  );

  renderTextField = ({ fileName, label, id, customStyles, customLabelStyles, customInputStyles }) =>
    ifElse(
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
          iconComponent={this.iconComponent({ id, label })}
        />
      ),
      () => this.iconComponent({ id, label })
    )(!!label);

  render() {
    const {
      id,
      fileName,
      label,
      customStyles,
      customLabelStyles,
      customInputStyles,
      iconComponent,
      ...props
    } = this.props;

    return (
      <div style={containerStyles}>
        {this.renderTextField({ fileName, label, id, customStyles, customLabelStyles, customInputStyles })}
        <input style={inputStyles} aria-hidden id={id} type="file" {...props} />
      </div>
    );
  }
}
