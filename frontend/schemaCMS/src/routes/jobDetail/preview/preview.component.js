import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import { FormattedMessage } from 'react-intl';

import { Container } from './preview.styles';
import { TopHeader } from '../../../shared/components/topHeader';
import { BackButton, NavigationContainer } from '../../../shared/components/navigation';
import DataPreview from '../../../shared/components/dataPreview/dataPreview.component';
import browserHistory from '../../../shared/utils/history';
import messages from './preview.messages';

export class Preview extends PureComponent {
  static propTypes = {
    fetchPreview: PropTypes.func.isRequired,
    previewData: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        jobId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  getHeaderAndMenuConfig = () => ({
    headerTitle: <FormattedMessage {...messages.title} />,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  handleBackClick = () => browserHistory.push(`/job/${path(['match', 'params', 'jobId'], this.props)}`);

  render() {
    const topHeaderConfig = this.getHeaderAndMenuConfig();
    const { match, ...restProps } = this.props;
    const jobId = path(['params', 'jobId'])(match);

    return (
      <Container>
        <TopHeader {...topHeaderConfig} />
        <DataPreview {...restProps} jobId={jobId} />
        <NavigationContainer>
          <BackButton onClick={this.handleBackClick} />
        </NavigationContainer>
      </Container>
    );
  }
}
