import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { Select } from '../../../shared/components/form/select';
import { Container, Form } from './create.styles';
import {
  PROJECT_DESCRIPTION,
  PROJECT_OWNER,
  PROJECT_STATUS,
  PROJECT_STATUSES_LIST,
  PROJECT_TITLE,
} from '../../../modules/project/project.constants';

import messages from './create.messages';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getMatchParam, filterMenuOptions } from '../../../shared/utils/helpers';
import { getProjectMenuOptions } from '../project.constants';

export class Create extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    userRole: PropTypes.string,
    isAdmin: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    if (!this.props.isAdmin) {
      this.props.history.push('/not-authorized');
    }
  }

  getStatusOptions = intl =>
    PROJECT_STATUSES_LIST.map(status => ({
      value: status,
      label: intl.formatMessage(messages[status]),
    }));

  handleCancelClick = () => this.props.history.push('/');

  handleSelectStatus = setFieldValue => ({ value: selectedStatus }) => {
    setFieldValue(PROJECT_STATUS, selectedStatus);
  };

  render() {
    const { values, handleChange, handleSubmit, setFieldValue, intl, isValid, isSubmitting, userRole } = this.props;
    const headerTitle = <FormattedMessage {...messages.pageTitle} />;
    const headerSubtitle = <FormattedMessage {...messages.pageSubTitle} />;
    const projectId = getMatchParam(this.props, 'projectId');
    const menuOptions = getProjectMenuOptions(projectId);

    return (
      <Container>
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <Form onSubmit={handleSubmit}>
          <TextInput
            value={values[PROJECT_TITLE]}
            onChange={handleChange}
            name={PROJECT_TITLE}
            label={intl.formatMessage(messages.projectTitleLabel)}
            placeholder={intl.formatMessage(messages.projectTitlePlaceholder)}
            fullWidth
            isEdit
            {...this.props}
          />
          <TextInput
            value={values[PROJECT_DESCRIPTION]}
            onChange={handleChange}
            name={PROJECT_DESCRIPTION}
            placeholder={intl.formatMessage(messages.projectDescriptionPlaceholder)}
            label={intl.formatMessage(messages.projectDescriptionLabel)}
            fullWidth
            isEdit
            {...this.props}
          />
          <TextInput
            value={values[PROJECT_OWNER]}
            onChange={handleChange}
            name={PROJECT_OWNER}
            disabled
            readOnly
            label={intl.formatMessage(messages.projectOwnerLabel)}
            fullWidth
            {...this.props}
          />
          <Select
            label={intl.formatMessage(messages.statusLabel)}
            name={PROJECT_STATUS}
            value={values[PROJECT_STATUS]}
            options={this.getStatusOptions(intl)}
            onSelect={this.handleSelectStatus(setFieldValue)}
            id="fieldProjectStatus"
          />
          <NavigationContainer fixed>
            <BackButton type="button" id="cancelBtn" onClick={this.handleCancelClick}>
              <FormattedMessage {...messages.cancel} />
            </BackButton>
            <NextButton type="submit" id="finishBtn" loading={isSubmitting} disabled={!isValid || isSubmitting}>
              <FormattedMessage {...messages.finish} />
            </NextButton>
          </NavigationContainer>
        </Form>
      </Container>
    );
  }
}
