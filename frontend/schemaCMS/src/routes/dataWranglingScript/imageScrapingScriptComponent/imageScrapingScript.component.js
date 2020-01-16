import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { FormattedMessage } from 'react-intl';
import { darcula, defaultStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Form as FormUI, Typography } from 'schemaUI';
import {
  always,
  append,
  difference,
  equals,
  find,
  ifElse,
  isEmpty,
  isNil,
  path,
  pathOr,
  pipe,
  propEq,
  reject,
} from 'ramda';

import { STEPS_PAGE } from '../../../modules/dataSource/dataSource.constants';
import {
  DATA_WRANGLING_FORM_NAME,
  DESCRIPTION,
} from '../../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { Container, customInputStyles, Form } from './imageScrapingScript.styles';
import messages from './imageScrapingScript.messages';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { getMatchParam } from '../../../shared/utils/helpers';
import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import reportError from '../../../shared/utils/reportError';
import { InfoContainer } from '../../../shared/components/container/container.styles';
import { DATA_WRANGLING_SCRIPT_MENU_OPTIONS } from '../dataWranglingScript.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';

const { CheckboxGroup, Checkbox, Label } = FormUI;
const { Span } = Typography;

export class ImageScrapingScript extends PureComponent {
  static propTypes = {
    fetchDataSource: PropTypes.func.isRequired,
    dataWranglingScript: PropTypes.object,
    dataWranglingScripts: PropTypes.array.isRequired,
    fetchDataWranglingScripts: PropTypes.func.isRequired,
    fieldsWithUrls: PropTypes.array.isRequired,
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
    error: null,
    loading: true,
    selectedFields: [],
  };

  async componentDidMount() {
    try {
      const dataSourceId = getMatchParam(this.props, 'dataSourceId');
      const scriptId = parseInt(getMatchParam(this.props, 'scriptId'), 10);
      const { fetchDataSource, dataWranglingScripts, imageScrapingFields } = this.props;
      const dataSource = await fetchDataSource(path(['match', 'params'], this.props));

      if (isEmpty(dataWranglingScripts)) {
        await this.props.fetchDataWranglingScripts({ dataSourceId });
      }

      const selectedFields = pipe(
        pathOr([], ['activeJob', 'scripts']),
        find(propEq('id', scriptId)),
        ifElse(isNil, always(imageScrapingFields), path(['options', 'columns']))
      )(dataSource);
      this.setState({ loading: false, selectedFields });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
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
    const dataSourceId = getMatchParam(this.props, 'dataSourceId');

    return history.push(`/datasource/${dataSourceId}/${STEPS_PAGE}`, { fromScript: true });
  };

  handleSaveClick = () => {
    const { selectedFields } = this.state;
    const scriptId = getMatchParam(this.props, 'scriptId');
    const dataSourceId = getMatchParam(this.props, 'dataSourceId');

    return this.props.setImageScrapingFields({
      imageScrapingFields: selectedFields,
      scriptId,
      dataSourceId,
    });
  };

  renderCheckbox = (name, index) => (
    <Checkbox id={`checkbox-${index}`} value={name} key={index}>
      <Span>{name}</Span>
    </Checkbox>
  );

  renderContent = fields =>
    renderWhenTrueOtherwise(
      always(
        <InfoContainer>
          <FormattedMessage {...messages.noFieldFound} />
        </InfoContainer>
      ),
      always(
        <CheckboxGroup
          onChange={this.handleChange}
          value={this.state.selectedFields}
          name="fields"
          id="fieldCheckboxGroup"
          customStyles={{ border: 'none' }}
        >
          {fields.map(this.renderCheckbox)}
        </CheckboxGroup>
      )
    )(isEmpty(fields));

  render() {
    const headerConfig = this.getHeaderAndMenuConfig();
    const { intl, dataWranglingScript, match, history, isAdmin, fieldsWithUrls, imageScrapingFields } = this.props;
    const { loading, error, selectedFields } = this.state;
    const syntaxTheme = isAdmin ? darcula : defaultStyle;
    const isCleanForm = isEmpty([
      ...difference(imageScrapingFields, selectedFields),
      ...difference(selectedFields, imageScrapingFields),
    ]);

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
        <Helmet title={intl.formatMessage(messages.pageTitle)} />
        <MobileMenu {...headerConfig} options={DATA_WRANGLING_SCRIPT_MENU_OPTIONS} />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        <Form name={DATA_WRANGLING_FORM_NAME}>
          <TextInput {...descriptionFieldProps} />
          <SyntaxHighlighter language="python" style={syntaxTheme}>
            {dataWranglingScript.body}
          </SyntaxHighlighter>
          <Label>
            <FormattedMessage {...messages.fieldsWithUrls} />
          </Label>
          <LoadingWrapper loading={loading} error={error}>
            {this.renderContent(fieldsWithUrls)}
          </LoadingWrapper>
        </Form>
        <NavigationContainer>
          <BackButton id="imageScrapingBackBtn" onClick={this.handleGoToDataWranglingList(match, history)} />
          <NextButton id="imageScrapingNextBtn" onClick={this.handleSaveClick} disabled={isCleanForm || loading}>
            <FormattedMessage {...messages.save} />
          </NextButton>
        </NavigationContainer>
      </Container>
    );
  }
}
