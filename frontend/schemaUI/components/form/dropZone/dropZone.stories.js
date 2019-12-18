import React, { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';
import PropTypes from 'prop-types';

import { DropZone } from './dropZone.component';
import { FileUpload } from '../fileUpload/fileUpload.component';
import { withTheme } from '../../../.storybook/decorators';

const id = 'file';

class DropZoneWapper extends PureComponent {
  static propTypes = {
    hidden: PropTypes.bool,
    multiple: PropTypes.bool,
    accept: PropTypes.string,
  };

  state = {
    fileNames: [],
  };

  onChange = data => {
    const files = data.currentTarget ? data.currentTarget.files : data;
    const fileNames = [...files].map(({ name }) => name);
    this.setState({ fileNames });
  };

  renderName = (name, index) => <div key={index}>{name}</div>;

  render() {
    const { multiple, hidden, accept } = this.props;
    return (
      <div style={{ position: 'relative' }}>
        <FileUpload id={id} onChange={this.onChange} multiple={multiple} accept={accept} />
        <DropZone
          id={id}
          onChange={this.onChange}
          hidden={hidden}
          multiple={multiple}
          accept={accept}
          label="Drop files here"
        />
        {this.state.fileNames.map(this.renderName)}
      </div>
    );
  }
}

storiesOf('Form|DropZone', module)
  .addDecorator(withTheme())
  .add('Default', () => <DropZoneWapper />)
  .add('Hidden', () => <DropZoneWapper hidden />)
  .add('Multiple', () => <DropZoneWapper multiple />)
  .add('Accept only images', () => <DropZoneWapper accept=".png, .jpg, .jpeg, .gif" />);
