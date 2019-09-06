import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';

import { Container } from './previewTable.styles';

export class PreviewTable extends PureComponent {
  static propTypes = {};

  render() {
    return <Container>PreviewTable component</Container>;
  }
}
