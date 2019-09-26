import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icons } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import { backButtonStyles, buttonIconStyles, Container, Navigation, nextButtonStyles } from './navigation.styles';
import messages from './navigation.messages';

const { PlusIcon, ArrowLeftIcon } = Icons;

export class NavigationContainer extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
    right: PropTypes.bool,
  };

  static defaultProps = {
    right: false,
  };

  render() {
    return (
      <Container>
        <Navigation right={this.props.right}>{this.props.children}</Navigation>
      </Container>
    );
  }
}

export class PlusButton extends PureComponent {
  render() {
    return (
      <Button customStyles={buttonIconStyles} onClick={this.handleCreateDataSource} {...this.props}>
        <PlusIcon />
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
    children: PropTypes.element,
  };

  render() {
    return (
      <Button customStyles={backButtonStyles} {...this.props}>
        {this.props.children || <FormattedMessage {...messages.back} />}
      </Button>
    );
  }
}

export class NextButton extends PureComponent {
  static propTypes = {
    children: PropTypes.element,
  };

  render() {
    return (
      <Button inverse customStyles={nextButtonStyles} {...this.props}>
        {this.props.children || <FormattedMessage {...messages.next} />}
      </Button>
    );
  }
}
