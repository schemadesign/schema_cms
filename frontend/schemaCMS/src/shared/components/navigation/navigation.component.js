import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icons, Button } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import {
  buttonIconStyles,
  Container,
  Navigation,
  NavigationContent,
  NavigationButton,
  ButtonContainer,
} from './navigation.styles';
import messages from './navigation.messages';

const { PlusIcon, ArrowLeftIcon } = Icons;

export class NavigationContainer extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    right: PropTypes.bool,
    hideOnDesktop: PropTypes.bool,
  };

  static defaultProps = {
    right: false,
    hideOnDesktop: false,
  };

  render() {
    return (
      <Container>
        <Navigation>
          <NavigationContent right={this.props.right} hideOnDesktop={this.props.hideOnDesktop}>
            {this.props.children}
          </NavigationContent>
        </Navigation>
      </Container>
    );
  }
}

export class PlusButton extends PureComponent {
  static propTypes = {
    hideOnDesktop: PropTypes.bool,
  };

  static defaultProps = {
    hideOnDesktop: false,
  };

  render() {
    const { hideOnDesktop, ...restProps } = this.props;
    return (
      <ButtonContainer hideOnDesktop={hideOnDesktop}>
        <Button inverse customStyles={buttonIconStyles} {...restProps}>
          <PlusIcon inverse />
        </Button>
      </ButtonContainer>
    );
  }
}

export class BackArrowButton extends PureComponent {
  render() {
    return (
      <Button customStyles={buttonIconStyles} {...this.props}>
        <ArrowLeftIcon />
      </Button>
    );
  }
}

export class BackButton extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    return (
      <NavigationButton {...this.props}>
        {this.props.children || <FormattedMessage {...messages.back} />}
      </NavigationButton>
    );
  }
}

export class NextButton extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: false,
  };

  render() {
    const { loading, ...restProps } = this.props;

    return (
      <NavigationButton inverse {...restProps}>
        {this.props.children || <FormattedMessage {...messages.next} values={{ loading }} />}
      </NavigationButton>
    );
  }
}
