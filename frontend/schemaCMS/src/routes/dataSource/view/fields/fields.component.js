import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { Container } from './fields.styles';
import messages from './fields.messages';
import { StepNavigation } from '../../../../shared/components/stepNavigation';
import DataPreview from '../../../../shared/components/dataPreview/dataPreview.component';

export class Fields extends PureComponent {
  static propTypes = {
    previewData: PropTypes.object.isRequired,
    fetchPreview: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    dataSource: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <DataPreview {...this.props} />
        <StepNavigation {...this.props} />
      </Container>
    );
  }
}
