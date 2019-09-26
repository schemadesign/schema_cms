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
      leftButtonProps: { title: leftTitle, customStyles: leftCustomStyles = {}, ...leftProps },
      rightButtonProps: { title: rightTitle, customStyles: rightCustomStyles = {}, ...rightProps },
    } = this.props;

    const leftStyles = { ...leftButtonStyles, ...leftCustomStyles };
    const rightStyles = { ...rightButtonStyles, ...rightCustomStyles };

    return (
      <Container>
        <Button {...leftProps} customStyles={leftStyles}>
          {leftTitle}
        </Button>
        <Button {...rightProps} inverse customStyles={rightStyles}>
          {rightTitle}
        </Button>
      </Container>
    );
  }
}
