import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'schemaUI';

import { Container } from '../../../shared/components/styledComponents/container';
import { TopHeader } from '../../../shared/components/topHeader';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { Select } from '../../../shared/components/form/select';
import { Form, buttonStyles } from './create.styles';
import {
  PROJECT_DESCRIPTION,
  PROJECT_TITLE,
  PROJECT_OWNER,
  PROJECT_STATUS,
  PROJECT_STATUSES,
  PROJECT_STATUSES_LIST,
} from '../../../modules/project/project.constants';

import messages from './create.messages';

export class Create extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.object,
  };

  state = { selectedStatus: PROJECT_STATUSES.IN_PROGRESS };

  getHeaderAndMenuConfig = intl => ({
    headerTitle: intl.formatMessage(messages.pageTitle),
    headerSubtitle: intl.formatMessage(messages.pageSubTitle),
  });

  getStatusOptions = (selectedStatus, intl) =>
    PROJECT_STATUSES_LIST.map(status => ({
      value: status,
      label: intl.formatMessage(messages[status]),
      selected: status === selectedStatus,
    }));

  handleCancelClick = () => this.props.history.push('/');

  handleSelectStatus = ({ value: selectedStatus }) => this.setState({ selectedStatus });

  render() {
    const { values, handleChange, handleSubmit, intl } = this.props;
    const topHeaderConfig = this.getHeaderAndMenuConfig(intl);

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        <Form onSubmit={handleSubmit}>
          <TextInput
            value={values[PROJECT_TITLE]}
            onChange={handleChange}
            name={PROJECT_TITLE}
            label={intl.formatMessage(messages.projectTitleLabel)}
            placeholder="Project title"
            {...this.props}
          />
          <TextInput
            value={values[PROJECT_DESCRIPTION]}
            onChange={handleChange}
            name={PROJECT_DESCRIPTION}
            placeholder="Project description"
            label={intl.formatMessage(messages.projectDescriptionLabel)}
            {...this.props}
          />
          <TextInput
            value={values[PROJECT_OWNER]}
            onChange={handleChange}
            name={PROJECT_OWNER}
            disabled
            readOnly
            label={intl.formatMessage(messages.projectOwnerLabel)}
            {...this.props}
          />
          <Select
            label={intl.formatMessage(messages.statusLabel)}
            name={PROJECT_STATUS}
            options={this.getStatusOptions(this.state.selectedStatus, intl)}
            onChange={handleChange}
            onSelect={this.handleSelectStatus}
          />
          <Button customStyles={buttonStyles} onClick={this.handleCancelClick}>
            {intl.formatMessage(messages.cancel)}
          </Button>
          <Button customStyles={buttonStyles}>{intl.formatMessage(messages.submit)}</Button>
        </Form>
      </Container>
    );
  }
}
