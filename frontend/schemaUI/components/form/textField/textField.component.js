import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles, errorStyles, iconContainerStyles } from './textField.styles';
import { EditIcon } from '../../icons/editIcon';
import { Input } from '../input';
import { TextArea } from '../textArea';
import { Label } from '../label';

export class TextField extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    customInputStyles: PropTypes.object,
    customLabelStyles: PropTypes.object,
    iconComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    error: PropTypes.bool,
    multiline: PropTypes.bool,
    fullWidth: PropTypes.bool,
  };

  static defaultProps = {
    type: 'text',
    error: false,
    fullWidth: false,
    customInputStyles: {},
    customLabelStyles: {},
  };

  renderLabel = ({ label, ...props }) => (label ? <Label label={label} {...props} /> : null);
  renderInput = props => <Input {...props} />;
  renderTextArea = props => <TextArea {...props} />;

  render() {
    const {
      customStyles,
      customInputStyles,
      customLabelStyles,
      iconComponent,
      name,
      label,
      error,
      multiline,
      fullWidth,
      ...restProps
    } = this.props;
    const errorFieldStyles = error ? errorStyles : {};
    const styles = { ...containerStyles, ...customStyles };
    const fieldStyles = { ...customInputStyles, ...errorFieldStyles };
    const renderField = multiline ? this.renderTextArea : this.renderInput;

    styles.maxWidth = fullWidth ? '100%' : '320px';

    return (
      <div style={styles}>
        {this.renderLabel({ label, name, customStyles: customLabelStyles })}
        {renderField({ name, ...restProps, customStyles: fieldStyles })}
        <div style={iconContainerStyles}>{this.props.iconComponent}</div>
      </div>
    );
  }
}
