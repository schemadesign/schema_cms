import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './select.styles';
import { withStyles } from '../../styles/withStyles';
import { find, pipe, prop, propOr } from 'ramda';
import { filterAllowedAttributes } from '../../../utils/helpers';

export class SelectComponent extends PureComponent {
  static propTypes = {
    native: PropTypes.bool,
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    native: false,
    placeholder: '',
  };

  state = {
    isMenuOpen: false,
    hoverIndex: null,
  };

  handleOptionClick = ({ target: { value } }) => {
    const selectedOption = this.props.options.find(option => option.value === value);
    this.props.onSelect(selectedOption);

    this.setState({
      isMenuOpen: false,
    });
  };

  onClickDocument = () => {
    this.setState({ isMenuOpen: false });
    document.removeEventListener('click', this.onClickDocument);
  };

  toggleMenu = () => {
    const isMenuOpen = !this.state.isMenuOpen;
    if (isMenuOpen) {
      document.addEventListener('click', this.onClickDocument);
    }

    this.setState({ isMenuOpen });
  };

  renderSelectedOption = ({ selectedOptionStyles }, label) => <div style={selectedOptionStyles}>{label}</div>;

  renderOptions = ({ value, label, selected }, index, { customOptionStyle, hoverStyles }) => {
    const eventObj = {
      target: {
        value: value,
      },
    };
    const actionStyles = selected || index === this.state.hoverIndex ? hoverStyles : {};

    return (
      <div
        key={index}
        id={`select-item-${index}`}
        style={{ ...customOptionStyle(index), ...actionStyles }}
        onMouseOver={() => this.setState({ hoverIndex: index })}
        onMouseOut={() => this.setState({ hoverIndex: null })}
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
    const filteredProps = filterAllowedAttributes('select', restProps);

    return (
      <select style={getSelectStyle(hidden)} onChange={onChange} {...filteredProps}>
        {options.map(this.renderNativeOptions)}
      </select>
    );
  };

  renderCustomSelect = ({ selectWrapperStyles, selectedOptionsStyles, optionListStyles, ...restStyles }, props) => {
    const { id } = props;
    const label = pipe(
      prop('options'),
      find(({ selected }) => selected),
      propOr(this.props.placeholder, 'label')
    )(this.props);

    return (
      <div id={id} style={selectWrapperStyles}>
        <div style={selectedOptionsStyles} onClick={this.toggleMenu}>
          {this.renderSelectedOption(restStyles, label)}
        </div>
        <div style={optionListStyles(this.state.isMenuOpen)}>
          {this.props.options.map((item, index) => this.renderOptions(item, index, restStyles))}
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
