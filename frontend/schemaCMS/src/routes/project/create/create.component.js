import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Typography, Button } from 'schemaUI';

import { Container } from './create.styles';
import { TextInput } from '../../../shared/components/form/inputs/textInput';
import { PROJECT_DESCRIPTION, PROJECT_TITLE, PROJECT_OWNER } from '../../../modules/project/project.constants';

import messages from './create.messages';

const { H2, H1 } = Typography;

export class Create extends PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { values, handleChange, handleSubmit, intl } = this.props;

    return (
      <Container>
        <Header>
          <H1>{intl.formatMessage(messages.pageTitle)}</H1>
          <H2>{intl.formatMessage(messages.pageSubTitle)}</H2>
        </Header>
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
