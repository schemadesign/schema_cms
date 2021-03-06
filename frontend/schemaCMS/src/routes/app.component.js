import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { Theme, ThemeProvider as ThemeUIProvider } from 'schemaUI';
import { ThemeProvider } from 'styled-components';
import Modal from 'react-modal';

import { DEFAULT_LOCALE, translationMessages } from '../i18n';
import { GlobalStyle } from '../theme/global';
import { DesktopHeader } from '../shared/components/desktopHeader';
import messages from './app.messages';
import { Container, Content } from './app.styles';
import { renderWhenTrue } from '../shared/utils/rendering';
import reportError from '../shared/utils/reportError';
import { LoadingWrapper } from '../shared/components/loadingWrapper';
import { ScrollToTop } from '../shared/components/scrollToTop';
import { ROLES } from '../modules/userProfile/userProfile.constants';
import { UserContext } from '../shared/utils/userProvider';

Modal.setAppElement('#app');

export class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    match: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    startup: PropTypes.func.isRequired,
    userRole: PropTypes.string,
    userId: PropTypes.string,
    projectTitle: PropTypes.string,
  };

  static defaultProps = {
    userRole: ROLES.EDITOR,
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      await this.props.startup();
    } catch (error) {
      reportError(error);
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  renderContent = loading => renderWhenTrue(() => React.Children.only(this.props.children))(!loading);

  render() {
    const { loading, error } = this.state;
    const { userRole, user, userId, projectTitle } = this.props;
    const theme = userRole === ROLES.ADMIN ? Theme.dark : Theme.light;

    return (
      <IntlProvider key={DEFAULT_LOCALE} locale={DEFAULT_LOCALE} messages={translationMessages[DEFAULT_LOCALE]}>
        <UserContext.Provider value={user}>
          <ThemeUIProvider theme={theme}>
            <ThemeProvider theme={theme}>
              <Container>
                <ScrollToTop />
                <FormattedMessage {...messages.pageTitle}>
                  {pageTitle => {
                    const title = Array.isArray(pageTitle) ? pageTitle[0] : pageTitle;
                    return <Helmet titleTemplate={`%s - ${title}`} defaultTitle={title} />;
                  }}
                </FormattedMessage>
                <GlobalStyle />
                <DesktopHeader userRole={userRole} userId={userId} title={projectTitle} />
                <Content>
                  <LoadingWrapper loading={loading} error={error}>
                    {this.renderContent()}
                  </LoadingWrapper>
                </Content>
              </Container>
            </ThemeProvider>
          </ThemeUIProvider>
        </UserContext.Provider>
      </IntlProvider>
    );
  }
}
