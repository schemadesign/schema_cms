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
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    customSelectedWrapperStyles: PropTypes.object,
  };

  static defaultProps = {
    native: false,
    placeholder: '',
    setOpen: null,
    open: null,
    customSelectedWrapperStyles: {},
  };

  state = {
    isMenuOpen: false,
    hoverIndex: null,
  };

  componentDidUpdate(prevProps) {
    if (this.props.setOpen && this.props.open && prevProps.open !== this.props.open) {
      document.addEventListener('click', this.onClickDocument);
    }
  }

  setOpenFunction = isMenuOpen => (this.props.setOpen ? this.props.setOpen(isMenuOpen) : this.setState({ isMenuOpen }));

  handleOptionClick = ({ target: { value } }) => {
    const selectedOption = this.props.options.find(option => option.value === value);
    this.props.onSelect(selectedOption);

    this.setOpenFunction(false);
  };

  onClickDocument = () => {
    this.setOpenFunction(false);

    document.removeEventListener('click', this.onClickDocument);
  };

  toggleMenu = () => {
    const isMenuOpen = !this.state.isMenuOpen;

    if (isMenuOpen) {
      document.addEventListener('click', this.onClickDocument);
    }

    this.setOpenFunction(isMenuOpen);
  };

  renderSelectedOption = ({ selectedOptionStyles }, label) => <div style={selectedOptionStyles}>{label}</div>;

  renderOptions = ({ value, label, selected, onClick }, index, { customOptionStyle, hoverStyles }) => {
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
        onClick={onClick ? onClick : () => this.handleOptionClick(eventObj)}
      >
        {label}
      </div>
    );
  };

  renderNativeOptions = ({ value, label, selected, onClick }, index) => (
    <option key={index} value={value} onClick={onClick}>
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
    const { id, setOpen, customSelectedWrapperStyles } = props;
    const label = pipe(
      prop('options'),
      find(({ selected }) => selected),
      propOr(this.props.placeholder, 'label')
    )(this.props);
    const isMenuOpen = setOpen ? this.props.open : !this.state.isMenuOpen;

    return (
      <div id={id} style={selectWrapperStyles}>
        <div
          style={{ ...selectedOptionsStyles, ...customSelectedWrapperStyles }}
          onClick={setOpen ? () => {} : this.toggleMenu}
        >
          {this.renderSelectedOption(restStyles, label)}
        </div>
        <div style={optionListStyles(isMenuOpen)}>
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
