import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { FormattedMessage } from 'react-intl';
import { defaultStyle, darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Form as FormUI, Typography } from 'schemaUI';
import { always, append, equals, ifElse, path, reject, pipe, propEq, find, isNil, pathOr } from 'ramda';

import { STEPS_PAGE } from '../../../modules/dataSource/dataSource.constants';
import {
  DATA_WRANGLING_FORM_NAME,
  DESCRIPTION,
} from '../../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { TopHeader } from '../../../shared/components/topHeader';
import { Container, Form, customInputStyles } from './imageScrapingScript.styles';
import messages from './imageScrapingScript.messages';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { getMatchParam } from '../../../shared/utils/helpers';
import { renderWhenTrue, renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { InfoContainer } from '../../../shared/components/container/container.styles';

const { CheckboxGroup, Checkbox } = FormUI;
const { Span } = Typography;

export class ImageScrapingScript extends PureComponent {
  static propTypes = {
    fetchDataSource: PropTypes.func.isRequired,
    dataWranglingScript: PropTypes.object,
    fieldNames: PropTypes.array.isRequired,
    imageScrapingFields: PropTypes.array.isRequired,
    setImageScrapingFields: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
        scriptId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    loading: true,
    selectedFields: [],
  };

  async componentDidMount() {
    try {
      const dataSource = await this.props.fetchDataSource(path(['match', 'params'], this.props));
      const scriptId = parseInt(getMatchParam(this.props, 'scriptId'), 10);
      const selectedFields = pipe(
        pathOr([], ['activeJob', 'scripts']),
        find(propEq('id', scriptId)),
        ifElse(isNil, always(this.props.imageScrapingFields), path(['options', 'columns']))
      )(dataSource);

      this.setState({ loading: false, selectedFields });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      this.setState({
        loading: false,
        error,
      });
    }
  }

  getHeaderAndMenuConfig = () => {
    const { intl, dataWranglingScript } = this.props;

    return {
      headerTitle: dataWranglingScript.title || intl.formatMessage(messages.title),
      headerSubtitle: intl.formatMessage(messages.subTitle),
    };
  };

  handleChange = ({ target: { value, checked } }) => {
    const values = this.state.selectedFields;
    const selectedFields = ifElse(equals(true), always(append(value, values)), always(reject(equals(value), values)))(
      checked
    );
    return this.setState({
      selectedFields,
    });
  };

  handleGoToDataWranglingList = (match, history) => () => {
    const { dataWranglingScript } = this.props;

    if (dataWranglingScript.isPredefined) {
      return history.goBack();
    }

    return history.push(`/datasource/${dataWranglingScript.datasource}/${STEPS_PAGE}`);
  };

  handleOkClick = () =>
    this.props.setImageScrapingFields({
      imageScrapingFields: this.state.selectedFields,
      scriptId: getMatchParam(this.props, 'scriptId'),
      dataSourceId: getMatchParam(this.props, 'dataSourceId'),
    });

  renderCheckboxes = (name, index) => (
    <Checkbox id={`checkbox-${index}`} value={name} key={index} isEdit>
      <Span>{name}</Span>
    </Checkbox>
  );

  renderContent = renderWhenTrueOtherwise(
    () => (
      <CheckboxGroup
        onChange={this.handleChange}
        value={this.state.selectedFields}
        name="fields"
        id="fieldCheckboxGroup"
      >
        {this.props.fieldNames.map(this.renderCheckboxes)}
      </CheckboxGroup>
    ),
    always(
      <InfoContainer>
        <FormattedMessage {...messages.noFieldFound} />
      </InfoContainer>
    )
  );

  render() {
    const headerConfig = this.getHeaderAndMenuConfig();
    const { intl, dataWranglingScript, match, history, isAdmin, fieldNames } = this.props;
    const { loading, error } = this.state;
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
          <LoadingWrapper loading={loading} error={error}>
            {this.renderContent(!!fieldNames.length)}
          </LoadingWrapper>
        </Form>
        <NavigationContainer>
          <BackButton id="imageScrapingBackBtn" onClick={this.handleGoToDataWranglingList(match, history)} />
          <NextButton id="imageScrapingNextBtn" onClick={this.handleOkClick}>
            <FormattedMessage {...messages.ok} />
          </NextButton>
        </NavigationContainer>
      </Container>
    );
  }
}
