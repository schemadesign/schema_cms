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
import { renderWhenTrue } from '../shared/utils/rendering';
import { LoadingWrapper } from '../shared/components/loadingWrapper';
import { ScrollToTop } from '../shared/components/scrollToTop';

Modal.setAppElement('#app');

export class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    match: PropTypes.object.isRequired,
    startup: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool,
    userId: PropTypes.string,
    projectTitle: PropTypes.string,
  };

  static defaultProps = {
    isAdmin: false,
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      await this.props.startup();
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  renderContent = loading => renderWhenTrue(() => React.Children.only(this.props.children))(!loading);

  render() {
    const { loading, error } = this.state;
    const { isAdmin, userId, projectTitle } = this.props;
    const theme = isAdmin ? Theme.dark : Theme.light;

    return (
      <IntlProvider key={DEFAULT_LOCALE} locale={DEFAULT_LOCALE} messages={translationMessages[DEFAULT_LOCALE]}>
        <ThemeUIProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <Container>
              <ScrollToTop />
              <FormattedMessage {...messages.pageTitle}>
                {pageTitle => <Helmet titleTemplate={`%s - ${pageTitle}`} defaultTitle={pageTitle} />}
              </FormattedMessage>
              <GlobalStyle />
              <DesktopTopHeader isAdmin={isAdmin} userId={userId} title={projectTitle} />
              <Content>
                <LoadingWrapper loading={loading} error={error}>
                  {this.renderContent()}
                </LoadingWrapper>
              </Content>
            </Container>
          </ThemeProvider>
        </ThemeUIProvider>
      </IntlProvider>
    );
  }
}
