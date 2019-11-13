import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { always } from 'ramda';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FormattedMessage } from 'react-intl';

import { DATA_WRANGLING_STEP } from '../../modules/dataSource/dataSource.constants';
import {
  DATA_WRANGLING_FORM_NAME,
  DESCRIPTION,
} from '../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { TextInput } from '../../shared/components/form/inputs/textInput';
import { Loader } from '../../shared/components/loader';
import { TopHeader } from '../../shared/components/topHeader';
import { renderWhenTrueOtherwise } from '../../shared/utils/rendering';
import { Container, Form, customInputStyles } from './dataWranglingScript.styles';
import messages from './dataWranglingScript.messages';
import { BackButton, NavigationContainer, NextButton } from '../../shared/components/navigation';
import { ContextHeader } from '../../shared/components/contextHeader';

export class DataWranglingScript extends PureComponent {
  static propTypes = {
    dataWranglingScript: PropTypes.object,
    fetchDataWranglingScript: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        scriptId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    const {
      match: {
        params: { scriptId },
      },
    } = this.props;
    await this.props.fetchDataWranglingScript({ scriptId });
    this.setState({ loading: false });
  }

  getHeaderAndMenuConfig = () => {
    const { intl, dataWranglingScript } = this.props;

    return {
      headerTitle: dataWranglingScript.title || intl.formatMessage(messages.title),
      headerSubtitle: intl.formatMessage(messages.subTitle),
    };
  };

  getContentOrLoader = renderWhenTrueOtherwise(always(<Loader />), this.renderContent);

  handleGoToDataWranglingList = (match, history) => () => {
    const { dataWranglingScript } = this.props;

    if (dataWranglingScript.isPredefined) {
      return history.goBack();
    }

    return history.push(`/datasource/${dataWranglingScript.datasource}/${DATA_WRANGLING_STEP}`);
  };

  renderContent() {
    const { intl, dataWranglingScript, match, history } = this.props;

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
      <Fragment>
        <Form name={DATA_WRANGLING_FORM_NAME}>
          <TextInput {...descriptionFieldProps} />
          <SyntaxHighlighter language="python" style={darcula}>
            {dataWranglingScript.body}
          </SyntaxHighlighter>
        </Form>
        <NavigationContainer>
          <BackButton onClick={this.handleGoToDataWranglingList(match, history)} />
          <NextButton onClick={this.handleGoToDataWranglingList(match, history)}>
            <FormattedMessage {...messages.ok} />
          </NextButton>
        </NavigationContainer>
      </Fragment>
    );
  }

  render() {
    const { loading } = this.state;
    const content = this.getContentOrLoader(loading);
    const headerConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader {...headerConfig} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        {content}
      </Container>
    );
  }
}
