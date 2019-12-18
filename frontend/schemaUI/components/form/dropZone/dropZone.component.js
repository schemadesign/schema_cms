import React, { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getStyles } from './dropZone.styles';
import { withStyles } from '../../styles/withStyles';

export class DropZoneComponent extends PureComponent {
  static propTypes = {
    hidden: PropTypes.bool,
    multiple: PropTypes.bool,
    label: PropTypes.string,
    accept: PropTypes.string,
    onChange: Function.prototype.isRequired,
  };

  static defaultProps = {
    hidden: false,
    multiple: false,
    accept: '',
    label: '',
  };

  counter = 0;

  constructor(props) {
    super(props);

    this.dropRef = createRef();
  }

  componentDidMount() {
    document.addEventListener('drop', this.handleDragLeave);
    document.addEventListener('dragover', this.handleDragOver);
    document.addEventListener('dragenter', this.handleDragEnter);
    document.addEventListener('dragleave', this.handleDragLeave);
  }

  componentWillUnmount() {
    document.removeEventListener('drop', this.handleDragLeave);
    document.removeEventListener('dragover', this.handleDragOver);
    document.removeEventListener('dragenter', this.handleDragEnter);
    document.removeEventListener('dragleave', this.handleDragLeave);
  }

  handleDragLeave = () => {
    this.counter--;
    if (this.dropRef.current && this.props.hidden && this.counter === 0) {
      this.dropRef.current.style.display = 'none';
    }
  };

  handleDragEnter = () => {
    this.counter++;
    if (this.dropRef.current && this.props.hidden) {
      this.dropRef.current.style.display = 'block';
    }
  };

  handleDragOver = e => {
    e.preventDefault();

    if (this.dropRef.current.id !== e.target.id) {
      e.dataTransfer.effectAllowed = 'none';
      e.dataTransfer.dropEffect = 'none';
    }
  };

  handleDrop = e => {
    e.preventDefault();
    const acceptFiles = this.getAcceptFiles(e.dataTransfer.files);
    if (!acceptFiles.length) {
      return;
    }

    const files = this.props.multiple ? acceptFiles : [acceptFiles[0]];
    this.props.onChange(files);

    if (this.dropRef.current && this.props.hidden) {
      this.dropRef.current.style.display = 'none';
    }
  };

  getAcceptFiles = files => {
    const acceptedTypes = this.props.accept.replace(/\s/g, '').split(',');

    if (!acceptedTypes[0]) {
      return files;
    }

    return [...files].filter(
      ({ name, type }) => acceptedTypes.includes(type) || acceptedTypes.includes(name.match(/\.[0-9a-z]+$/i)[0])
    );
  };

  render() {
    const { hidden, id, theme, label } = this.props;
    const styles = getStyles(theme);
    const containerStyles = hidden ? { ...styles.containerStyles, ...styles.hiddenStyles } : styles.containerStyles;

    return (
      <label style={containerStyles} onDrop={this.handleDrop} ref={this.dropRef} id={`dropZone-${id}`} htmlFor={id}>
        {label}
      </label>
    );
  }
}

export const DropZone = withStyles(DropZoneComponent);
