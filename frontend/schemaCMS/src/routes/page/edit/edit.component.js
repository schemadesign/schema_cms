import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container } from './edit.styles';

export class Edit extends PureComponent {
  static propTypes = {
    page: PropTypes.object.isRequired,
  };

  render() {
    return <Container>{this.props.page.id}</Container>;
  }
}
