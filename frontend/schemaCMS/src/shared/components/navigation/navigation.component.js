import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import { buttonIconStyles, Container, Navigation, NavigationContent, buttonStyles } from './navigation.styles';
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
  render() {
    return (
      <Button inverse customStyles={buttonIconStyles} {...this.props}>
        <PlusIcon inverse />
      </Button>
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
      <Button className="nav-btn nav-btn--back" customStyles={buttonStyles} {...this.props}>
        {this.props.children || <FormattedMessage {...messages.back} />}
      </Button>
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
      <Button inverse className="nav-btn nav-btn--next" customStyles={buttonStyles} {...restProps}>
        {this.props.children || <FormattedMessage {...messages.next} values={{ loading }} />}
      </Button>
    );
  }
}
