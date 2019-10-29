import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './select.styles';
import { withStyles } from '../../styles/withStyles';

export class SelectComponent extends PureComponent {
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

  renderSelectedOption = ({ selectedOptionStyles }) => {
    const selectedOption = this.props.options.find(option => option.selected) || this.props.options[0];

    return <div style={selectedOptionStyles}>{selectedOption.label}</div>;
  };

  renderOptions = ({ value, label, selected }, index, { customOptionStyle }, id = '') => {
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

  renderNativeSelect = ({ hidden = false, restStyles: { getSelectStyle } }, restProps) => {
    const { options } = this.props;
    const onChange = !!hidden ? Function.prototype : this.handleOptionClick;

    return (
      <select style={getSelectStyle(hidden)} onChange={onChange} {...restProps}>
        {options.map(this.renderNativeOptions)}
      </select>
    );
  };

  renderCustomSelect = ({ selectWrapperStyles, selectedOptionsStyles, optionListStyles, ...restStyles }, props) => {
    const { id } = props;

    return (
      <div id={id} style={selectWrapperStyles}>
        <div style={selectedOptionsStyles} onClick={this.toggleMenu}>
          {this.renderSelectedOption(restStyles)}
        </div>
        <div style={optionListStyles(this.state.isMenuOpen)}>
          {this.props.options.map((item, index) => this.renderOptions(item, index, restStyles, id))}
        </div>
      </div>
    );
  };

  render() {
    const { native, theme, ...restProps } = this.props;
    const { containerStyles, ...restStyles } = getStyles(theme);

    return (
      <div style={containerStyles}>
        {native ? this.renderNativeSelect({ restStyles }, restProps) : this.renderCustomSelect(restStyles, restProps)}
      </div>
    );
  }
}

export const Select = withStyles(SelectComponent);
