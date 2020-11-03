import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { camelize } from 'humps';

import messages from './tagCategories.messages';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { NavigationContainer, PlusLink, LARGE_BUTTON_SIZE, BackLink } from '../../../shared/components/navigation';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { TAG_CATEGORIES_PAGE } from '../../../modules/project/project.constants';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { CardHeader } from '../../../shared/components/cardHeader';
import { ListContainer, ListItem, ListItemTitle } from '../../../shared/components/listComponents';
import {
  templatesMessage,
  ProjectBreadcrumbs,
  projectMessage,
  libraryMessage,
  tagsTemplateMessage,
  tabMessage,
} from '../../../shared/components/projectBreadcrumbs';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions } from '../project.constants';

const getBreadcrumbsItems = project => [
  {
    path: `/project/${project.id}/`,
    span: projectMessage,
    h3: project.title,
  },
  {
    path: `/project/${project.id}/templates`,
    span: tabMessage,
    h3: templatesMessage,
  },
  {
    path: `/project/${project.id}/tags-templates`,
    active: true,
    span: libraryMessage,
    h3: tagsTemplateMessage,
  },
];

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

  getCreateUrl = () => {
    const projectId = getMatchParam(this.props, 'projectId');
    return `/project/${projectId}/${TAG_CATEGORIES_PAGE}/create`;
  };

  renderTagCategory = ({ created, createdBy, name, id, tags }, index) => {
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
    const list = [whenCreated, createdBy];
    const header = <CardHeader list={list} />;
    const footer = <FormattedMessage {...messages.tagsCounter} values={{ count: tags.length }} />;

    return (
      <ListItem id="tagContainer" headerComponent={header} footerComponent={footer} key={index}>
        <ListItemTitle id={`tag-category-${camelize(name)}`} to={`/tag-category/${id}`}>
          {name}
        </ListItemTitle>
      </ListItem>
    );
  };

  renderContent = () => {
    const { tagCategories = [] } = this.props;

    return (
      <Fragment>
        <ListContainer>{tagCategories.map(this.renderTagCategory)}</ListContainer>
        <NavigationContainer fixed>
          <BackLink id="backBtn" to={`/project/${getMatchParam(this.props, 'projectId')}/templates`} />
          <PlusLink hideOnDesktop to={this.getCreateUrl()} size={LARGE_BUTTON_SIZE} />
        </NavigationContainer>
      </Fragment>
    );
  };

  render() {
    const { loading, error } = this.state;
    const { project, userRole } = this.props;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const menuOptions = getProjectMenuOptions(project.id);

    return (
      <Fragment>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <ProjectBreadcrumbs items={getBreadcrumbsItems(project)} />
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <PlusLink id="addTagCategoryBtn" to={this.getCreateUrl()} size={LARGE_BUTTON_SIZE} />
        </ContextHeader>
        <LoadingWrapper loading={loading} error={error}>
          {this.renderContent()}
        </LoadingWrapper>
      </Fragment>
    );
  }
}
