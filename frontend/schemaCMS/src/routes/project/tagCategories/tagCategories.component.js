import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';

import messages from './tagCategories.messages';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { TAG_CATEGORIES_PAGE } from '../../../modules/project/project.constants';
import { getProjectMenuOptions, PROJECT_TAG_CATEGORIES_ID } from '../project.constants';
import { TAG_CATEGORIES } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { CounterHeader } from '../../../shared/components/counterHeader';

export class TagCategories extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    tagCategories: PropTypes.array.isRequired,
    fetchTagCategories: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const projectId = getMatchParam(this.props, 'projectId');

      await this.props.fetchTagCategories({ projectId });
    } catch (error) {
      reportError(error);
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  handleCreateTag = () => {
    const projectId = getMatchParam(this.props, 'projectId');
    this.props.history.push(`/project/${projectId}/${TAG_CATEGORIES_PAGE}/create`);
  };

  handleShowProject = () => this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}`);

  renderContent = () => {
    const { tagCategories = [], intl } = this.props;

    return (
      <Fragment>
        <CounterHeader
          moveToTop
          copy={intl.formatMessage(messages.tagCategory)}
          customPlural={intl.formatMessage(messages.tagCategories)}
          count={tagCategories.length}
        />
        <Fragment>
          {tagCategories.map(({ name }, index) => (
            <div key={index}>{name}</div>
          ))}
          <NavigationContainer fixed>
            <BackArrowButton id="backBtn" hideOnDesktop onClick={this.handleShowProject} />
          </NavigationContainer>
        </Fragment>
      </Fragment>
    );
  };

  render() {
    const { loading, error } = this.state;
    const { project, userRole, match } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const menuOptions = getProjectMenuOptions(project.id);

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
          active={PROJECT_TAG_CATEGORIES_ID}
        />
        <ProjectTabs active={TAG_CATEGORIES} url={`/project/${match.params.projectId}`} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <PlusButton onClick={this.handleCreateTag} />
        </ContextHeader>
        <LoadingWrapper loading={loading} error={error}>
          {this.renderContent()}
        </LoadingWrapper>
      </Fragment>
    );
  }
}
