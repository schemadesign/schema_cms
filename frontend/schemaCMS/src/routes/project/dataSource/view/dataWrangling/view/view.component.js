import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { always, isEmpty } from 'ramda';

import { DESCRIPTION, CODE } from '../../../../../../modules/dataSource/dataSource.constants';
import { TextInput } from '../../../../../../shared/components/form/inputs/textInput';
import { Loader } from '../../../../../../shared/components/loader';
import { PillButtons } from '../../../../../../shared/components/pillButtons';
import { TopHeader } from '../../../../../../shared/components/topHeader';
import { renderWhenTrueOtherwise } from '../../../../../../shared/utils/rendering';
import { Container, Form, codeStyles, rightButtonStyles } from './view.styles';
import messages from './view.messages';

export class View extends PureComponent {
  static propTypes = {
    dataWrangling: PropTypes.object,
    fetchDataWrangling: PropTypes.func.isRequired,
    unmountDataWrangling: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.fetchDataWrangling();
  }

  componentWillUnmount() {
    this.props.unmountDataWrangling();
  }

  getHeaderAndMenuConfig = () => {
    const { intl, dataWrangling } = this.props;

    return {
      headerTitle: dataWrangling.title || intl.formatMessage(messages.title),
      headerSubtitle: intl.formatMessage(messages.subTitle),
    };
  };

  getContentOrLoader = renderWhenTrueOtherwise(always(<Loader />), this.renderContent);

  renderContent() {
    const { intl, dataWrangling } = this.props;

    const descriptionFieldProps = {
      name: DESCRIPTION,
      value: dataWrangling.description,
      label: intl.formatMessage(messages.description),
      placeholder: intl.formatMessage(messages.descriptionPlaceholder),
      fullWidth: true,
      disabled: true,
      onChange: Function.prototype,
    };

    const codeFieldProps = {
      name: CODE,
      value: dataWrangling.code,
      label: intl.formatMessage(messages.code),
      placeholder: intl.formatMessage(messages.codePlaceholder),
      fullWidth: true,
      disabled: true,
      multiline: true,
      customInputStyles: codeStyles,
      onChange: Function.prototype,
    };

    return (
      <Fragment>
        <Form>
          <TextInput {...descriptionFieldProps} />
          <TextInput {...codeFieldProps} />
        </Form>
        <PillButtons
          leftButtonProps={{
            title: intl.formatMessage(messages.back),
            onClick: () => {},
          }}
          rightButtonProps={{
            title: intl.formatMessage(messages.ok),
            onClick: () => {},
            customStyles: rightButtonStyles,
          }}
        />
      </Fragment>
    );
  }

  render() {
    const content = this.getContentOrLoader(isEmpty(this.props.dataWrangling));
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
