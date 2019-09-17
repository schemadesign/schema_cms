import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import {
  containerStyles,
  selectWrapperStyles,
  getSelectStyle,
  customOptionStyle,
  selectedOptionsStyles,
  optionListStyles,
  selectedOptionStyles,
} from './select.styles';

export class Select extends PureComponent {
  static propTypes = {
    native: PropTypes.bool,
    defaultOption: PropTypes.object,
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    native: false,
  };

  state = {
    isMenuOpen: false,
  };

  handleOptionClick = ({ target: { value } }) => {
    const selectedOption = this.props.options.find(option => option.value === value);
    this.props.onSelect(selectedOption);

    this.setState({
      isMenuOpen: false,
    });
  };

  toggleMenu = () => this.setState({ isMenuOpen: !this.state.isMenuOpen });

  renderSelectedOption = () => {
    const selectedOption = this.props.options.find(option => option.selected) || this.props.options[0];

    return <div style={selectedOptionStyles}>{selectedOption.label}</div>;
  };

  renderOptions = ({ value, label, selected }, index) => {
    const eventObj = {
      target: {
        value: value,
      },
    };

    return (
      <div
        key={index}
        id={`select-item-${index}`}
        style={customOptionStyle(index)}
        onClick={() => this.handleOptionClick(eventObj)}
      >
        {label}
      </div>
    );
  };

  renderNativeOptions = ({ value, label, selected }, index) => (
    <option key={index} value={value}>
      {label}
    </option>
  );

  renderNativeSelect = (hidden = false) => {
    const { options } = this.props;
    const onChange = !!hidden ? Function.prototype : this.handleOptionClick;

    return (
      <select style={getSelectStyle(hidden)} onChange={onChange}>
        {options.map(this.renderNativeOptions)}
      </select>
    );
  };

  renderSelect = isNative =>
    isNative ? (
      this.renderNativeSelect()
    ) : (
      <div style={selectWrapperStyles}>
        <div style={selectedOptionsStyles} onClick={this.toggleMenu}>
          {this.renderSelectedOption()}
        </div>
        <div style={optionListStyles(this.state.isMenuOpen)}>{this.props.options.map(this.renderOptions)}</div>
      </div>
    );

  render() {
    const { native } = this.props;

    return <div style={containerStyles}>{this.renderSelect(native)}</div>;
  }
}
