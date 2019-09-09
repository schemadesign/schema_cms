import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'schemaUI';

import { Container } from './create.styles';
import { TopHeader } from '../../../shared/components/topHeader';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { PROJECT_DESCRIPTION, PROJECT_TITLE, PROJECT_OWNER } from '../../../modules/project/project.constants';

import messages from './create.messages';

export class Create extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  getHeaderAndMenuConfig = intl => ({
    headerTitle: intl.formatMessage(messages.pageTitle),
    headerSubtitle: intl.formatMessage(messages.pageSubTitle),
  });

  render() {
    const { values, handleChange, handleSubmit, intl } = this.props;
    const topHeaderConfig = this.getHeaderAndMenuConfig(intl);

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        <form onSubmit={handleSubmit}>
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
          <Button>{intl.formatMessage(messages.submit)}</Button>
        </form>
      </Container>
    );
  }
}
