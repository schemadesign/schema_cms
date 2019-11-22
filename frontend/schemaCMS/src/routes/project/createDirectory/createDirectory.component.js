import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { path } from 'ramda';

import { Form } from './createDirectory.styles';
import messages from './createDirectory.messages';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { DIRECTORY_NAME } from '../../../modules/directory/directory.constants';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';

export class CreateDirectory extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
  };

  getHeaderAndMenuConfig = () => ({
    headerTitle: <FormattedMessage {...messages.title} />,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  getProjectId = () => path(['match', 'params', 'projectId'], this.props);

  handleBackClick = () => this.props.history.push(`/project/${this.getProjectId()}/directory`);

  render() {
    const { intl, values, handleSubmit, handleChange, ...restProps } = this.props;
    const topHeaderConfig = this.getHeaderAndMenuConfig();

    return (
      <Fragment>
        <TopHeader headerTitle={topHeaderConfig.headerTitle} headerSubtitle={topHeaderConfig.headerSubtitle} />
        <ContextHeader title={topHeaderConfig.headerTitle} subtitle={topHeaderConfig.headerSubtitle} />
        <Form onSubmit={handleSubmit}>
          <TextInput
            value={values[DIRECTORY_NAME]}
            onChange={handleChange}
            name={DIRECTORY_NAME}
            label={intl.formatMessage(messages.directoryFieldName)}
            placeholder={intl.formatMessage(messages.directoryFieldPlaceholder)}
            fullWidth
            isEdit
            {...restProps}
          />
          <NavigationContainer hideOnDesktop>
            <BackButton id="backBtn" onClick={this.handleBackClick}>
              <FormattedMessage {...messages.back} />
            </BackButton>
            <NextButton id="createDirectoryBtn" type="submit" disabled={!restProps.isValid}>
              <FormattedMessage {...messages.createDirectory} />
            </NextButton>
          </NavigationContainer>
        </Form>
      </Fragment>
    );
  }
}
