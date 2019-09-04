import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'schemaUI';

import { Container, leftButtonStyles, rightButtonStyles } from './pillButtons.styles';

export class PillButtons extends PureComponent {
  static propTypes = {
    leftButtonTitle: PropTypes.string,
    rightButtonTitle: PropTypes.string,
    onLeftClick: PropTypes.func,
    onRightClick: PropTypes.func,
  };

  render() {
    const { onLeftClick, onRightClick, leftButtonTitle, rightButtonTitle } = this.props;
    return (
      <Container>
        <Button type="button" onClick={onLeftClick} customStyles={leftButtonStyles}>
          {leftButtonTitle}
        </Button>
        <Button type="submit" onClick={onRightClick} customStyles={rightButtonStyles}>
          {rightButtonTitle}
        </Button>
      </Container>
    );
  }
}
