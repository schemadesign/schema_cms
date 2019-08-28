import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from 'schemaUI';

import { FormattedMessage } from 'react-intl';

import messages from './home.messages';
import { Container } from './home.styles';
import { H1 } from '../../theme/typography';
import { ROUTES } from '../index';

export class Home extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <Button>Test</Button>
        <H1>
          <FormattedMessage {...messages.welcome} />
        </H1>
        <Link to={ROUTES.PROJECTS}>Projects List</Link>
      </Container>
    );
  }
}
