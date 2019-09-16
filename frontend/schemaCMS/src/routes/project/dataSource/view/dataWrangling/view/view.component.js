import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { isEmpty } from 'ramda';

import { TextInput } from '../../../../../../shared/components/form/inputs/textInput';
import { Loader } from '../../../../../../shared/components/loader';
import { PillButtons } from '../../../../../../shared/components/pillButtons';
import { TopHeader } from '../../../../../../shared/components/topHeader';
import { Container, Content, Form, codeStyles, rightButtonStyles } from './view.styles';
import messages from './view.messages';

export class View extends PureComponent {
  static propTypes = {
    dataWrangling: PropTypes.object,
    fetchDataWrangling: PropTypes.func.isRequired,
    unmountDataWrangling: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps({ dataWrangling }, { isLoading }) {
    if (isLoading && !isEmpty(dataWrangling)) {
      return {
        isLoading: false,
      };
    }

    return null;
  }

  state = {
    isLoading: true,
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

  renderContent() {
    const { intl, dataWrangling } = this.props;

    const descriptionFieldProps = {
      name: 'description',
      value: dataWrangling.description,
      label: intl.formatMessage(messages.description),
      placeholder: intl.formatMessage(messages.descriptionPlaceholder),
      fullWidth: true,
      disabled: true,
      onChange: Function.prototype,
    };

    const codeFieldProps = {
      name: 'code',
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
      <Content>
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
      </Content>
    );
  }

  render() {
    const content = this.state.isLoading ? <Loader /> : this.renderContent();
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
