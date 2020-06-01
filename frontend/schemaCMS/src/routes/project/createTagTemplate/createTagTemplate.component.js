import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Form } from './createTagTemplate.styles';
import messages from './createTagTemplate.messages';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { TagCategoryForm } from '../../../shared/components/tagCategoryForm';
import { BackButton, NavigationContainer, NextButton } from '../../../shared/components/navigation';
import { TAG_CATEGORIES_PAGE } from '../../../modules/project/project.constants';
import { getProjectMenuOptions } from '../project.constants';
import {
  createMessage,
  ProjectBreadcrumbs,
  projectMessage,
  tabMessage,
  tagsMessage,
  templateMessage,
} from '../../../shared/components/projectBreadcrumbs';

const getBreadcrumbsItems = project => [
  {
    path: `/project/${project.id}/`,
    span: projectMessage,
    h3: project.title,
  },
  {
    path: `/project/${project.id}/tag-categories`,
    span: tabMessage,
    h3: tagsMessage,
  },
  {
    path: `/project/${project.id}/tag-categories/create`,
    active: true,
    span: templateMessage,
    h3: createMessage,
  },
];

export class CreateTagTemplate extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    dirty: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
  };

  getHeaderAndMenuConfig = () => ({
    headerTitle: <FormattedMessage {...messages.title} />,
    headerSubtitle: <FormattedMessage {...messages.subTitle} />,
  });

  handleBack = () =>
    this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}/${TAG_CATEGORIES_PAGE}`);

  render() {
    const { project, userRole, isSubmitting, isValid, dirty, handleSubmit } = this.props;
    const headerConfig = this.getHeaderAndMenuConfig();
    const menuOptions = getProjectMenuOptions(project.id);

    return (
      <Form onSubmit={handleSubmit}>
        <MobileMenu
          headerTitle={headerConfig.headerTitle}
          headerSubtitle={headerConfig.headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
        <ContextHeader title={headerConfig.headerTitle} subtitle={headerConfig.headerSubtitle} />
        <ProjectBreadcrumbs items={getBreadcrumbsItems(project)} />
        <TagCategoryForm {...this.props} />
        <NavigationContainer fixed>
          <BackButton onClick={this.handleBack} type="button">
            <FormattedMessage {...messages.cancel} />
          </BackButton>
          <NextButton loading={isSubmitting} disabled={!dirty || !isValid || isSubmitting} type="submit">
            <FormattedMessage {...messages.saveTag} />
          </NextButton>
        </NavigationContainer>
      </Form>
    );
  }
}
