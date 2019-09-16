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

const DEFAULT_OPTION = { value: 'default', label: 'Select one of the list', selected: true };

export class Select extends PureComponent {
  static propTypes = {
    native: PropTypes.bool,
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    native: false,
  };

  state = {
    selectedOption: DEFAULT_OPTION,
    isMenuOpen: false,
  };

  selectRef = createRef();

  handleOptionClick = ({ target: { value } }) => {
    const selectedOption = this.props.options.find(option => option.value === value);
    this.props.onSelect(selectedOption);

    this.setState({
      isMenuOpen: false,
    });
  };

  toggleMenu = () => this.setState({ isMenuOpen: !this.state.isMenuOpen });

  renderSelectedOption = () => {
    const selectedOption = this.props.options.find(option => option.selected) || DEFAULT_OPTION;

    return (
      <div style={selectedOptionStyles} onClick={this.toggleMenu}>
        {selectedOption.label}
      </div>
    );
  };

  renderOptions = ({ value, label, selected }, index) => {
    const eventObj = {
      target: {
        value: value,
      },
    };

    return (
      <div key={index} style={customOptionStyle} onClick={() => this.handleOptionClick(eventObj)}>
        {label}
      </div>
    );
  };

  renderNativeOptions = ({ value, label, selected }, index) => (
    <option key={index} value={value} selected={selected}>
      {label}
    </option>
  );

  renderNativeSelect = (hidden = false) => {
    const { options, ...restPros } = this.props;

    return (
      <select ref={this.selectRef} style={getSelectStyle(hidden)}>
        {options.map(this.renderNativeOptions)}
      </select>
    );
  };

  renderSelect = isNative =>
    isNative ? (
      this.renderNativeSelect()
    ) : (
      <div style={selectWrapperStyles}>
        {this.renderNativeSelect(!isNative)}
        <div style={selectedOptionsStyles}>{this.renderSelectedOption()}</div>
        <div style={optionListStyles(this.state.isMenuOpen)}>{this.props.options.map(this.renderOptions)}</div>
      </div>
    );

  render() {
    const { native } = this.props;

    return <div style={containerStyles}>{this.renderSelect(native)}</div>;
  }
}
