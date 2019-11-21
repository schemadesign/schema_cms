import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import { Container } from './directoryList.styles';
import messages from '../dataSourceList/dataSourceList.messages';
import { TopHeader } from '../../../shared/components/topHeader';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { DIRECTORY, SOURCES } from '../../../shared/components/projectTabs/projectTabs.constants';

export class DirectoryList extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }),
    }),
  };

  render() {
    const { match } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ProjectTabs active={DIRECTORY} url={`/project/${match.params.projectId}`} />
      </Container>
    );
  }
}
