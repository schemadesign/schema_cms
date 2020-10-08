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
  LinkButton,
} from './navigation.styles';
import messages from './navigation.messages';

const { PlusIcon, ArrowLeftIcon } = Icons;

export class NavigationContainer extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    right: PropTypes.bool,
    fixed: PropTypes.bool,
    padding: PropTypes.string,
    hideOnDesktop: PropTypes.bool,
    contentStyles: PropTypes.array,
  };

  static defaultProps = {
    right: false,
    fixed: false,
    hideOnDesktop: false,
    contentStyles: null,
  };

  render() {
    const { right, hideOnDesktop, children, fixed, padding, contentStyles } = this.props;

    return (
      <Container>
        <Navigation fixed={fixed} padding={padding}>
          <NavigationContent right={right} hideOnDesktop={hideOnDesktop} contentStyles={contentStyles}>
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
    customStyles: PropTypes.object,
  };

  static defaultProps = {
    hideOnDesktop: false,
    customStyles: {},
  };

  render() {
    const { hideOnDesktop, customStyles, ...restProps } = this.props;
    return (
      <ButtonContainer hideOnDesktop={hideOnDesktop}>
        <Button inverse customStyles={{ ...buttonIconStyles, ...customStyles }} {...restProps}>
          <PlusIcon customStyles={customStyles} inverse />
        </Button>
      </ButtonContainer>
    );
  }
}

export const LARGE_BUTTON_SIZE = 60;
export const SMALL_BUTTON_SIZE = 60;

export const PlusLink = ({ hideOnDesktop = false, size = SMALL_BUTTON_SIZE, to = '', id = '' }) => (
  <LinkButton inverse to={to} size={size} hideOnDesktop={hideOnDesktop}>
    <PlusIcon inverse customStyles={{ width: size, height: size }} id={id} />
  </LinkButton>
);

PlusLink.propTypes = {
  hideOnDesktop: PropTypes.bool,
  size: PropTypes.object,
  to: PropTypes.string.isRequired,
  id: PropTypes.string,
};

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

export const BackLink = ({ children, disabled = false, ...restProps }) => (
  <NavigationLink disabled={disabled} {...restProps} inverse={false}>
    {children || <FormattedMessage {...messages.back} />}
  </NavigationLink>
);

BackLink.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  disabled: PropTypes.bool,
};

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

    return (
      <NavigationLink inverse {...restProps}>
        {children}
      </NavigationLink>
    );
  }
}
