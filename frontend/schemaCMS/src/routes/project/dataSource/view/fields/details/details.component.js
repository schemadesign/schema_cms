import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Container } from './details.styles';

export class Details extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
  };

  render() {
    const ids = Object.keys(this.props.data);

    return (
      <Container>
        <ul>
          <li>
            <h2>{this.props.id}</h2>
          </li>
          {ids.map((fieldId, index) => (
            <li key={index}>
              {fieldId}
              <b> {this.props.data[fieldId]}</b>
            </li>
          ))}
        </ul>
      </Container>
    );
  }
}
