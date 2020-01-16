import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Form } from './createFolder.styles';
import messages from './createFolder.messages';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { FOLDER_NAME } from '../../../modules/folder/folder.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { getMatchParam, filterMenuOptions } from '../../../shared/utils/helpers';
import { getProjectMenuOptions, NONE } from '../project.constants';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';

export class CreateFolder extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string,
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

  handleBackClick = () => this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}/folder`);

  render() {
    const { intl, values, handleSubmit, handleChange, isValid, isSubmitting, userRole, ...restProps } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const projectId = getMatchParam(this.props, 'projectId');
    const menuOptions = getProjectMenuOptions(projectId);

    return (
      <Fragment>
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
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
