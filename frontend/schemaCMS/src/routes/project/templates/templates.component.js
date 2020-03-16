import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import { Container } from './templates.styles';
import messages from './templates.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import { getProjectMenuOptions, PROJECT_TEMPLATES_ID } from '../project.constants';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { TEMPLATES } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { StatisticCards } from '../../../shared/components/statisticCards';

export class Templates extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired,
    templates: PropTypes.object.isRequired,
    fetchTemplates: PropTypes.func.isRequired,
  };

  state = {
    error: null,
    loading: true,
  };

  async componentDidMount() {
    try {
      const projectId = getMatchParam(this.props, 'projectId');
      await this.props.fetchTemplates({ projectId });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  renderContent = () => {
    const { templates } = this.props;
    const projectId = getMatchParam(this.props, 'projectId');

    const statistics = [
      {
        header: messages.block,
        value: templates.blocks,
        to: `/project/${projectId}/block-templates`,
        id: 'blockTemplates',
      },
      {
        header: messages.page,
        value: templates.pages,
        to: `/project/${projectId}/page-templates`,
        id: 'pageTemplates',
      },
      {
        header: messages.filter,
        value: templates.filters,
        to: `/project/${projectId}/filter-templates`,
        id: 'filterTemplates',
      },
      {
        header: messages.state,
        value: templates.states,
        to: `/project/${projectId}/state-templates`,
        id: 'stateTemplates',
      },
    ];

    return <StatisticCards statistics={statistics} history={this.props.history} />;
  };

  render() {
    const { userRole, match, intl } = this.props;
    const { loading, error } = this.state;
    const title = <FormattedMessage {...messages.title} />;
    const subtitle = <FormattedMessage {...messages.subtitle} />;
    const projectId = getMatchParam(this.props, 'projectId');
    const menuOptions = getProjectMenuOptions(projectId);

    return (
      <Container>
        <Helmet title={intl.formatMessage(messages.title)} />
        <MobileMenu
          headerTitle={title}
          headerSubtitle={subtitle}
          options={filterMenuOptions(menuOptions, userRole)}
          active={PROJECT_TEMPLATES_ID}
        />
        <ProjectTabs active={TEMPLATES} url={`/project/${match.params.projectId}`} />
        <ContextHeader title={title} subtitle={subtitle} />
        <LoadingWrapper loading={loading} error={error}>
          {this.renderContent()}
        </LoadingWrapper>
      </Container>
    );
  }
}
