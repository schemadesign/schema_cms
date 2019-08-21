import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { containerStyles, defaultInputStyles, defaultLabelStyles } from './textField.styles';

export class TextField extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    customInputStyles: PropTypes.object,
    customLabelStyles: PropTypes.object,
    iconComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    error: PropTypes.bool,
  };

  static defaultProps = {
    type: 'text',
    error: false,
    customInputStyles: {},
    customLabelStyles: {},
  };

  renderLabel = label => {
    const { customLabelStyles, name } = this.props;
    const labelStyles = { ...defaultLabelStyles, ...customLabelStyles };

    return label ? (
      <label style={labelStyles} htmlFor={name}>
        {label}
      </label>
    ) : null;
  };

  render() {
    const { customStyles, customInputStyles, name, label, error, ...restProps } = this.props;
    const styles = { ...containerStyles, ...customStyles };
    const inputStyles = { ...defaultInputStyles, ...customInputStyles };

    return (
      <div style={styles}>
        {this.renderLabel(label)}
        <input id={name} {...restProps} style={inputStyles} />
      </div>
    );
  }
}
