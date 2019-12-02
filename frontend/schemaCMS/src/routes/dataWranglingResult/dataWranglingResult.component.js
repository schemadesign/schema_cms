import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { path } from 'ramda';

import messages from './dataWranglingResult.messages';
import { Container } from './dataWranglingResult.styles';
import { StepNavigation } from '../../shared/components/stepNavigation';
import DataPreview from '../../shared/components/dataPreview/dataPreview.component';

export class DataWranglingResult extends PureComponent {
  static propTypes = {
    previewData: PropTypes.object.isRequired,
    dataSource: PropTypes.object,
    fetchPreview: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  };

  getActiveJobId = () => path(['dataSource', 'activeJob', 'id'], this.props);

  render() {
    const activeJobId = this.getActiveJobId(this.props);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <DataPreview {...this.props} jobId={activeJobId} />
        <StepNavigation {...this.props} />
      </Container>
    );
  }
}
