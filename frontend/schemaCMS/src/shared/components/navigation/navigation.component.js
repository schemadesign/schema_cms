import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';
import { always, cond, propEq, T, prop } from 'ramda';

import {
  ButtonContainer,
  buttonIconStyles,
  Container,
  Navigation,
  NavigationButton,
  NavigationContent,
  NavigationLink,
} from './navigation.styles';
import messages from './navigation.messages';

const { PlusIcon, ArrowLeftIcon } = Icons;

export class NavigationContainer extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    right: PropTypes.bool,
    fixed: PropTypes.bool,
    hideOnDesktop: PropTypes.bool,
  };

  static defaultProps = {
    right: false,
    fixed: false,
    hideOnDesktop: false,
  };

  render() {
    const { right, hideOnDesktop, children, fixed } = this.props;

    return (
      <Container>
        <Navigation fixed={fixed}>
          <NavigationContent right={right} hideOnDesktop={hideOnDesktop}>
            {children}
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
    children: null,
  };

  renderContent = cond([
    [propEq('loading', true), always(<FormattedMessage {...messages.loading} />)],
    [propEq('children', null), always(<FormattedMessage {...messages.next} />)],
    [T, prop('children')],
  ]);

  render() {
    const { loading, children, ...restProps } = this.props;

    return (
      <NavigationButton inverse {...restProps}>
        {this.renderContent({ loading, children })}
      </NavigationButton>
    );
  }
}

export class ConfirmLink extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  };

  render() {
    const { children, ...restProps } = this.props;

    return <NavigationLink {...restProps}>{children}</NavigationLink>;
  }
}
