import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { FormattedMessage } from 'react-intl';
import { defaultStyle, darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { DATA_WRANGLING_STEP } from '../../../modules/dataSource/dataSource.constants';
import {
  DATA_WRANGLING_FORM_NAME,
  DESCRIPTION,
} from '../../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { TopHeader } from '../../../shared/components/topHeader';
import { Container, Form, customInputStyles } from './dataWranglingScript.styles';
import messages from './dataWranglingScript.messages';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { ContextHeader } from '../../../shared/components/contextHeader';

export class DataWranglingScriptComponent extends PureComponent {
  static propTypes = {
    dataWranglingScript: PropTypes.object,
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        scriptId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
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

    if (dataWranglingScript.isPredefined) {
      return history.goBack();
    }

    return history.push(`/datasource/${dataWranglingScript.datasource}/${DATA_WRANGLING_STEP}`);
  };

  render() {
    const headerConfig = this.getHeaderAndMenuConfig();
    const { intl, dataWranglingScript, match, history, isAdmin } = this.props;
    const syntaxTheme = isAdmin ? darcula : defaultStyle;

    const descriptionFieldProps = {
      name: DESCRIPTION,
      value: dataWranglingScript.name,
      label: intl.formatMessage(messages.description),
      placeholder: intl.formatMessage(messages.descriptionPlaceholder),
      fullWidth: true,
      disabled: true,
      onChange: Function.prototype,
      customInputStyles,
    };

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader {...headerConfig} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        <Form name={DATA_WRANGLING_FORM_NAME}>
          <TextInput {...descriptionFieldProps} />
          <SyntaxHighlighter language="python" style={syntaxTheme}>
            {dataWranglingScript.body}
          </SyntaxHighlighter>
        </Form>
        <NavigationContainer>
          <BackButton onClick={this.handleGoToDataWranglingList(match, history)} />
          <NextButton onClick={this.handleGoToDataWranglingList(match, history)}>
            <FormattedMessage {...messages.ok} />
          </NextButton>
        </NavigationContainer>
      </Container>
    );
  }
}
