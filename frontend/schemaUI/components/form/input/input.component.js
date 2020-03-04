import React, { Fragment, PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';

import { getStyles, MIN_WIDTH } from './input.styles';
import { withStyles } from '../../styles/withStyles';
import { filterAllowedAttributes } from '../../../utils/helpers';

class InputComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    theme: PropTypes.object,
    autoWidth: PropTypes.bool,
  };

  state = {
    inputWidth: this.props.autoWidth ? MIN_WIDTH : null,
    alternativeValue: this.props.value,
  };

  componentDidMount() {
    if (this.props.autoWidth) {
      this.setState({ alternativeValue: this.props.value });

      setTimeout(() => {
        if (this.spanRef.current) {
          this.setState({ inputWidth: this.spanRef.current.offsetWidth });
        }
      });
    }
  }

  spanRef = createRef();

  handleChange = e => {
    if (this.props.autoWidth) {
      this.setState({ alternativeValue: e.target.value });
      const { value, name, id } = e.target;

      return setTimeout(() => {
        this.setState({ inputWidth: this.spanRef.current.offsetWidth });
        this.props.onChange({ target: { name, value, id } });
      });
    }

    this.props.onChange(e);
  };

  render() {
    const { customStyles = {}, autoWidth = false, theme, inputRef, ...restProps } = this.props;
    const { alternativeValue, inputWidth } = this.state;
    const { defaultStyles, hiddenStyles } = getStyles(theme);
    const inputStyles = { ...defaultStyles, ...customStyles };
    const filteredProps = filterAllowedAttributes('input', restProps);

    return (
      <Fragment>
        <input
          id={restProps.name}
          style={inputWidth ? { ...inputStyles, width: inputWidth + 20 } : inputStyles}
          ref={inputRef}
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
