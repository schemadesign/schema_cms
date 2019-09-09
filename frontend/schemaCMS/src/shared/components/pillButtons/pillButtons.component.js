import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'schemaUI';

import { Container, leftButtonStyles, rightButtonStyles } from './pillButtons.styles';

export class PillButtons extends PureComponent {
  static propTypes = {
    leftButtonProps: PropTypes.object,
    rightButtonProps: PropTypes.object,
  };

  render() {
    const {
      leftButtonProps: { title: leftTitle, ...leftProps },
      rightButtonProps: { title: rightTitle, ...rightProps },
    } = this.props;

    return (
      <Container>
        <Button {...leftProps} customStyles={leftButtonStyles}>
          {leftTitle}
        </Button>
        <Button {...rightProps} customStyles={rightButtonStyles}>
          {rightTitle}
        </Button>
      </Container>
    );
  }
}
