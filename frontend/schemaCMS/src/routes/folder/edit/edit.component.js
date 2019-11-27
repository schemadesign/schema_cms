import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { path } from 'ramda';

import { Form } from './edit.styles';
import messages from './edit.messages';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { FOLDER_NAME } from '../../../modules/folder/folder.constants';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';

export class Edit extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    folder: PropTypes.object.isRequired,
    isValid: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    fetchFolder: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        folderId: PropTypes.string.isRequired,
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
      const folderId = path(['match', 'params', 'folderId'], this.props);
      await this.props.fetchFolder({ folderId });
      this.setState({ loading: false });
    } catch (e) {
      this.props.history.push('/');
    }
  }

  handleBackClick = () => this.props.history.push(`/project/${path(['folder', 'project'], this.props)}/folder`);

  renderContent = () => (
    <TextInput
      value={this.props.values[FOLDER_NAME]}
      onChange={this.props.handleChange}
      name={FOLDER_NAME}
      label={this.props.intl.formatMessage(messages.folderFieldName)}
      placeholder={this.props.intl.formatMessage(messages.folderFieldPlaceholder)}
      fullWidth
      isEdit
      {...this.props}
    />
  );

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
          <LoadingWrapper loading={loading}>{this.renderContent()}</LoadingWrapper>
          <NavigationContainer>
            <BackButton id="backBtn" onClick={this.handleBackClick}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton id="editFolderBtn" type="submit" disabled={!isValid}>
              <FormattedMessage {...messages.createFolder} />
            </NextButton>
          </NavigationContainer>
        </Form>
      </Fragment>
    );
  }
}
