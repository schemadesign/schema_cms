import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { Theme, ThemeProvider as ThemeUIProvider } from 'schemaUI';
import { ThemeProvider } from 'styled-components';
import Modal from 'react-modal';

import { DEFAULT_LOCALE, translationMessages } from '../i18n';
import { GlobalStyle } from '../theme/global';
import messages from './app.messages';
import { Container } from './app.styles';
import { ROLES } from '../modules/userProfile/userProfile.constants';

Modal.setAppElement('#app');

export class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    match: PropTypes.object.isRequired,
    startup: PropTypes.func.isRequired,
    userData: PropTypes.object,
  };

  static defaultProps = {
    userData: {},
  };

  componentDidMount() {
    this.props.startup();
  }

  render() {
    const theme = this.props.userData.role !== ROLES.ADMIN ? Theme.light : Theme.dark;

    return (
      <IntlProvider key={DEFAULT_LOCALE} locale={DEFAULT_LOCALE} messages={translationMessages[DEFAULT_LOCALE]}>
        <ThemeUIProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <Container>
              <FormattedMessage {...messages.pageTitle}>
                {pageTitle => <Helmet titleTemplate={`%s - ${pageTitle}`} defaultTitle={pageTitle} />}
              </FormattedMessage>

              <GlobalStyle />
              {React.Children.only(this.props.children)}
            </Container>
          </ThemeProvider>
        </ThemeUIProvider>
      </IntlProvider>
    );
  }
}
