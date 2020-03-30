import React, { createRef, Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'throttle-debounce';

import { getStyles, MIN_WIDTH } from './input.styles';
import { withStyles } from '../../styles/withStyles';
import { filterAllowedAttributes } from '../../../utils/helpers';

class InputComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    theme: PropTypes.object,
    autoWidth: PropTypes.bool,
    autoFocus: PropTypes.bool,
  };

  state = {
    inputWidth: this.props.autoWidth ? MIN_WIDTH : null,
    alternativeValue: this.props.value,
    stateValue: this.props.value,
    autoFocus: false,
  };
  spanRef = createRef();
  inputRef = createRef();
  handleThrottle = debounce(200, this.props.onChange);

  componentDidMount() {
    if (this.props.autoWidth) {
      setTimeout(() => {
        if (this.spanRef.current) {
          this.setState({ inputWidth: this.spanRef.current.offsetWidth });
        }
      });
    }

    if (this.props.autoFocus && this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  handleChange = e => {
    if (this.props.autoWidth) {
      const { value, name, id } = e.target;
      this.setState({ alternativeValue: value, stateValue: value });

      return setTimeout(() => {
        this.setState({ inputWidth: this.spanRef.current.offsetWidth });
        this.handleThrottle({ target: { value, name, id } });
      });
    }

    this.props.onChange(e);
  };

  render() {
    const {
      customStyles = {},
      autoWidth = false,
      theme,
      inputRef,
      onChange,
      value,
      autoFocus,
      ...restProps
    } = this.props;
    const { alternativeValue, inputWidth, stateValue } = this.state;
    const { defaultStyles, hiddenStyles } = getStyles(theme);
    const inputStyles = { ...defaultStyles, ...customStyles };
    const filteredProps = filterAllowedAttributes('input', restProps);

    return (
      <Fragment>
        <input
          id={restProps.name}
          style={inputWidth ? { ...inputStyles, width: inputWidth + 20 } : inputStyles}
          ref={autoFocus ? this.inputRef : inputRef}
          value={autoWidth ? stateValue : value}
          {...filteredProps}
          onChange={this.handleChange}
        />
        {autoWidth ? (
          <div style={{ ...inputStyles, ...hiddenStyles }} ref={this.spanRef}>
            {alternativeValue}
          </div>
        ) : null}
      </Fragment>
    );
  }
}

export const Input = withStyles(InputComponent);
