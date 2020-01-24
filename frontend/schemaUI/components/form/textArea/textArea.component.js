import React, { createRef, Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './textArea.styles';
import { withStyles } from '../../styles/withStyles';
import { filterAllowedAttributes } from '../../../utils/helpers';

export class TextAreaComponent extends PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
  };

  static defaultProps = {
    customStyles: {},
  };

  componentDidMount() {
    this.syncHeight();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.syncHeight();
    }
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
    const height = innerHeight + (boxSizing === 'border-box' ? padding + border : 0);

    inputShallow.value = 'x';

    this.setState({ height });
  };

  render() {
    const { customStyles, name, theme, ...restProps } = this.props;
    const { height } = this.state;
    const { defaultStyles, shadowStyles } = getStyles(theme);
    const styles = { ...defaultStyles, ...customStyles };
    const filteredProps = filterAllowedAttributes('textarea', restProps);

    return (
      <Fragment>
        <textarea
          id={name}
          style={{ height, ...styles }}
          {...filteredProps}
          onChange={this.handleChange}
          ref={this.textAreaRef}
        />
        <textarea aria-hidden readOnly tabIndex={-1} style={{ ...shadowStyles, ...styles }} ref={this.shadowRef} />
      </Fragment>
    );
  }
}

export const TextArea = withStyles(TextAreaComponent);
