import React, { PureComponent, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';

import { defaultStyles, shadowStyles } from './textArea.styles';

export class TextArea extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  static defaultProps = {
    customStyles: {},
  };

  componentDidMount() {
    this.syncHeight();
  }

  constructor(props) {
    super(props);

    this.textAreaRef = createRef();
    this.shadowRef = createRef();
  }

  state = {
    height: 0,
  };

  handleChange = event => {
    this.syncHeight();

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  getStyleValue = (computedStyle, property) => parseInt(computedStyle[property], 10) || 0;

  syncHeight = () => {
    const input = this.textAreaRef.current;
    const inputShallow = this.shadowRef.current;

    if (!input || !inputShallow) {
      return;
    }

    const computedStyle = window.getComputedStyle(input);

    inputShallow.style.width = computedStyle.width;
    inputShallow.value = input.value || this.props.placeholder || 'x';

    const boxSizing = computedStyle['box-sizing'];
    const padding =
      this.getStyleValue(computedStyle, 'padding-bottom') + this.getStyleValue(computedStyle, 'padding-top');
    const border =
      this.getStyleValue(computedStyle, 'border-bottom-width') + this.getStyleValue(computedStyle, 'border-top-width');
    const innerHeight = inputShallow.scrollHeight - padding;
    const singleRowHeight = inputShallow.scrollHeight - padding;
    const outerHeight = Math.max(innerHeight, singleRowHeight);
    const height = outerHeight + (boxSizing === 'border-box' ? padding + border : 0);

    inputShallow.value = 'x';

    this.setState({ height });
  };

  render() {
    const { customStyles, name, ...restProps } = this.props;
    const { height } = this.state;
    const styles = { ...defaultStyles, ...customStyles };

    return (
      <Fragment>
        <textarea
          {...restProps}
          id={name}
          style={{ height, ...styles }}
          onChange={this.handleChange}
          ref={this.textAreaRef}
        />
        <textarea aria-hidden readOnly tabIndex={-1} style={{ ...shadowStyles, ...styles }} ref={this.shadowRef} />
      </Fragment>
    );
  }
}
