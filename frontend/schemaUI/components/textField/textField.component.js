import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  containerStyles,
  defaultInputStyles,
  defaultLabelStyles,
  errorStyles,
  iconContainerStyles,
} from './textField.styles';
import { EditIcon } from '../icons/editIcon';

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
    multiline: PropTypes.bool,
  };

  static defaultProps = {
    type: 'text',
    error: false,
    customInputStyles: {},
    customLabelStyles: {},
    iconComponent: <EditIcon />,
  };

  state = {
    textAreaHeight: 50,
  };

  constructor(props) {
    super(props);
    this.textAreaRef = React.createRef();
  }

  renderLabel = ({ label, name, customLabelStyles }) => {
    const labelStyles = { ...defaultLabelStyles, ...customLabelStyles };

    return label ? (
      <label style={labelStyles} htmlFor={name}>
        {label}
      </label>
    ) : null;
  };

  renderInput = ({ name, restProps, inputStyles }) => {
    return <input id={name} {...restProps} style={inputStyles} />;
  };

  syncTestAreaHeight = () => {
    const textArea = this.textAreaRef.current;

    this.setState({ textAreaHeight: textArea.scrollHeight });
  };

  handleTextAreaChange = event => {
    this.syncTestAreaHeight();

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  renderTextArea = ({ name, restProps, inputStyles }) => {
    inputStyles.height = this.state.textAreaHeight;

    return (
      <textarea
        id={name}
        {...restProps}
        style={inputStyles}
        onChange={this.handleTextAreaChange}
        ref={this.textAreaRef}
      />
    );
  };

  render() {
    const {
      customStyles,
      customInputStyles,
      name,
      label,
      error,
      customLabelStyles,
      iconComponent,
      multiline,
      onChange,
      ...restProps
    } = this.props;
    const errorInputStyles = error ? errorStyles : {};
    const styles = { ...containerStyles, ...customStyles };
    const inputStyles = { ...defaultInputStyles, ...customInputStyles, ...errorInputStyles };
    const renderField = multiline ? this.renderTextArea : this.renderInput;

    return (
      <div style={styles}>
        {this.renderLabel({ label, name, customLabelStyles })}
        {renderField({ name, restProps, inputStyles })}
        <div style={iconContainerStyles}>{this.props.iconComponent}</div>
      </div>
    );
  }
}
