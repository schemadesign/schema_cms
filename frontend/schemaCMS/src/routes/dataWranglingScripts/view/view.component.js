import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { always, isEmpty } from 'ramda';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { DATA_WRANGLING_STEP } from '../../../modules/dataSource/dataSource.constants';
import {
  DATA_WRANGLING_FORM_NAME,
  DESCRIPTION,
} from '../../../modules/dataWranglingScripts/dataWranglingScripts.constants';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { Loader } from '../../../shared/components/loader';
import { PillButtons } from '../../../shared/components/pillButtons';
import { TopHeader } from '../../../shared/components/topHeader';
import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { Container, Form, rightButtonStyles } from './view.styles';
import messages from './view.messages';

export class View extends PureComponent {
  static propTypes = {
    dataWranglingScript: PropTypes.object,
    fetchDataWranglingScript: PropTypes.func.isRequired,
    unmountDataWrangling: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
        dataSourceId: PropTypes.string.isRequired,
        scriptId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const {
      match: {
        params: { scriptId, dataSourceId },
      },
    } = this.props;
    this.props.fetchDataWranglingScript({ scriptId, dataSourceId });
  }

  componentWillUnmount() {
    this.props.unmountDataWrangling();
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
    const { projectId, dataSourceId } = match.params;

    history.push(`/project/view/${projectId}/datasource/view/${dataSourceId}/${DATA_WRANGLING_STEP}`);
  };

  renderContent() {
    const { intl, dataWranglingScript, match, history } = this.props;

    const descriptionFieldProps = {
      name: DESCRIPTION,
      value: dataWranglingScript.key,
      label: intl.formatMessage(messages.description),
      placeholder: intl.formatMessage(messages.descriptionPlaceholder),
      fullWidth: true,
      disabled: true,
      onChange: Function.prototype,
    };

    return (
      <Fragment>
        <Form name={DATA_WRANGLING_FORM_NAME}>
          <TextInput {...descriptionFieldProps} />
          <SyntaxHighlighter language="python" style={darcula}>
            {dataWranglingScript.body}
          </SyntaxHighlighter>
        </Form>
        <PillButtons
          leftButtonProps={{
            title: intl.formatMessage(messages.back),
            onClick: this.handleGoToDataWranglingList(match, history),
          }}
          rightButtonProps={{
            title: intl.formatMessage(messages.ok),
            onClick: this.handleGoToDataWranglingList(match, history),
            customStyles: rightButtonStyles,
          }}
        />
      </Fragment>
    );
  }

  render() {
    const content = this.getContentOrLoader(isEmpty(this.props.dataWranglingScript));
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader {...topHeaderConfig} />
        {content}
      </Container>
    );
  }
}
