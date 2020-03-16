import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula, defaultStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Form } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import { STEPS_PAGE } from '../../../modules/dataSource/dataSource.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { Container, ScriptName, syntaxCustomStyles } from './dataWranglingDefaultScript.styles';
import messages from './dataWranglingDefaultScript.messages';
import { BackButton, NavigationContainer } from '../../../shared/components/navigation';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { getMatchParam } from '../../../shared/utils/helpers';
import { DATA_WRANGLING_SCRIPT_MENU_OPTIONS } from '../dataWranglingScript.constants';

const { Label } = Form;

export class DataWranglingDefaultScript extends PureComponent {
  static propTypes = {
    dataWranglingScript: PropTypes.object,
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
  };

  getHeaderAndMenuConfig = () => {
    const { intl, dataWranglingScript } = this.props;

    return {
      headerTitle: dataWranglingScript.title || intl.formatMessage(messages.title),
      headerSubtitle: intl.formatMessage(messages.subTitle),
    };
  };

  handleGoToDataWranglingList = (match, history) => () => {
    const { dataWranglingScript } = this.props;
    const dataSourceId = dataWranglingScript.datasource || getMatchParam(this.props, 'dataSourceId');

    return history.push(`/datasource/${dataSourceId}/${STEPS_PAGE}`, { fromScript: true });
  };

  render() {
    const headerConfig = this.getHeaderAndMenuConfig();
    const { dataWranglingScript, match, history, isAdmin } = this.props;
    const syntaxTheme = isAdmin ? darcula : defaultStyle;

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <MobileMenu {...headerConfig} options={DATA_WRANGLING_SCRIPT_MENU_OPTIONS} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        <Label>
          <FormattedMessage {...messages.description} />
        </Label>
        <ScriptName>{dataWranglingScript.name}</ScriptName>
        <Label>
          <FormattedMessage {...messages.pythonCode} />
        </Label>
        <SyntaxHighlighter id="pythonCode" language="python" style={syntaxTheme} customStyle={syntaxCustomStyles}>
          {dataWranglingScript.body}
        </SyntaxHighlighter>
        <NavigationContainer fixed>
          <BackButton onClick={this.handleGoToDataWranglingList(match, history)} />
        </NavigationContainer>
      </Container>
    );
  }
}
