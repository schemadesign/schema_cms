import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { ThemeProvider, Theme } from 'schemaUI';

import { DEFAULT_LOCALE, translationMessages } from '../i18n';
import { GlobalStyle } from '../theme/global';
import messages from './app.messages';
import { ROLES } from '../modules/userProfile/userProfile.constants';

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
    const theme = this.props.userData.role !== ROLES.ADMIN ? Theme.primary : Theme.secondary;

    return (
      <IntlProvider key={DEFAULT_LOCALE} locale={DEFAULT_LOCALE} messages={translationMessages[DEFAULT_LOCALE]}>
        <ThemeProvider theme={theme}>
          <Fragment>
            <FormattedMessage {...messages.pageTitle}>
              {pageTitle => <Helmet titleTemplate={`%s - ${pageTitle}`} defaultTitle={pageTitle} />}
            </FormattedMessage>

            <GlobalStyle />
            {React.Children.only(this.props.children)}
          </Fragment>
        </ThemeProvider>
      </IntlProvider>
    );
  }
}
