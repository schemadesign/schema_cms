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
import { ContextHeader } from '../../../shared/components/contextHeader';
import { getMatchParam } from '../../../shared/utils/helpers';

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

  handleBackClick = () => browserHistory.push(`/job/${getMatchParam(this.props, 'jobId')}`);

  render() {
    const { match, ...restProps } = this.props;
    const jobId = path(['params', 'jobId'])(match);
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
        <DataPreview {...restProps} jobId={jobId} />
        <NavigationContainer fixed>
          <BackButton onClick={this.handleBackClick} />
        </NavigationContainer>
      </Container>
    );
  }
}
