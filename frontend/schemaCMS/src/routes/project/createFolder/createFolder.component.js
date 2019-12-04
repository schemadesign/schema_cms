import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Form } from './createFolder.styles';
import messages from './createFolder.messages';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { FOLDER_NAME } from '../../../modules/folder/folder.constants';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { getProjectId } from '../../../shared/utils/helpers';

export class CreateFolder extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }),
    }),
    isValid: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
  };

  handleBackClick = () => this.props.history.push(`/project/${getProjectId(this.props)}/folder`);

  render() {
    const { intl, values, handleSubmit, handleChange, isValid, isSubmitting, ...restProps } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Fragment>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Form onSubmit={handleSubmit}>
          <TextInput
            value={values[FOLDER_NAME]}
            onChange={handleChange}
            name={FOLDER_NAME}
            label={intl.formatMessage(messages.folderFieldName)}
            placeholder={intl.formatMessage(messages.folderFieldPlaceholder)}
            fullWidth
            isEdit
            {...restProps}
          />
          <NavigationContainer fixed>
            <BackButton id="backBtn" type="button" onClick={this.handleBackClick}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton id="createFolderBtn" type="submit" loading={isSubmitting} disabled={!isValid || isSubmitting}>
              <FormattedMessage {...messages.createFolder} />
            </NextButton>
          </NavigationContainer>
        </Form>
      </Fragment>
    );
  }
}
