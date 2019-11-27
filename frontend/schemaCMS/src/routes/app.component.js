import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { Theme, ThemeProvider as ThemeUIProvider } from 'schemaUI';
import { ThemeProvider } from 'styled-components';
import Modal from 'react-modal';

import { DEFAULT_LOCALE, translationMessages } from '../i18n';
import { GlobalStyle } from '../theme/global';
import { DesktopTopHeader } from '../shared/components/desktopTopHeader';
import messages from './app.messages';
import { Container, Content } from './app.styles';

Modal.setAppElement('#app');

export class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    match: PropTypes.object.isRequired,
    startup: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool,
    history: PropTypes.object,
  };

  static defaultProps = {
    isAdmin: false,
  };

  componentDidMount() {
    this.props.startup();
  }

  render() {
    const theme = this.props.isAdmin ? Theme.dark : Theme.light;

    return (
      <IntlProvider key={DEFAULT_LOCALE} locale={DEFAULT_LOCALE} messages={translationMessages[DEFAULT_LOCALE]}>
        <ThemeUIProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <Container>
              <FormattedMessage {...messages.pageTitle}>
                {pageTitle => <Helmet titleTemplate={`%s - ${pageTitle}`} defaultTitle={pageTitle} />}
              </FormattedMessage>

              <GlobalStyle />
              <DesktopTopHeader history={this.props.history} />
              <Content>{React.Children.only(this.props.children)}</Content>
            </Container>
          </ThemeProvider>
        </ThemeUIProvider>
      </IntlProvider>
    );
  }
}
