import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { always, path } from 'ramda';

import { Form } from './edit.styles';
import messages from './edit.messages';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { DIRECTORY_NAME } from '../../../modules/directory/directory.constants';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { Loader } from '../../../shared/components/loader';

export class Edit extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    directory: PropTypes.object.isRequired,
    isValid: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    fetchDirectory: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        directoryId: PropTypes.string.isRequired,
      }),
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    try {
      const directoryId = path(['match', 'params', 'directoryId'], this.props);
      await this.props.fetchDirectory({ directoryId });
      this.setState({ loading: false });
    } catch (e) {
      this.props.history.push('/');
    }
  }

  handleBackClick = () => this.props.history.push(`/project/${path(['directory', 'project'], this.props)}/directory`);

  renderContent = renderWhenTrueOtherwise(always(<Loader />), () => (
    <TextInput
      value={this.props.values[DIRECTORY_NAME]}
      onChange={this.props.handleChange}
      name={DIRECTORY_NAME}
      label={this.props.intl.formatMessage(messages.directoryFieldName)}
      placeholder={this.props.intl.formatMessage(messages.directoryFieldPlaceholder)}
      fullWidth
      isEdit
      {...this.props}
    />
  ));

  render() {
    const { handleSubmit, isValid } = this.props;
    const { loading } = this.state;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Form onSubmit={handleSubmit}>
          {this.renderContent(loading)}
          <NavigationContainer>
            <BackButton id="backBtn" onClick={this.handleBackClick}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton id="editDirectoryBtn" type="submit" disabled={!isValid}>
              <FormattedMessage {...messages.createDirectory} />
            </NextButton>
          </NavigationContainer>
        </Form>
      </Fragment>
    );
  }
}
