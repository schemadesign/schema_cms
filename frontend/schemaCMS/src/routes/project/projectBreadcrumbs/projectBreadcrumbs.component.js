import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs, LinkItem, Typography } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import { Container, Link } from './projectBreadcrumbs.styles';
import messages from './projectBreadcrumbs.messages';

const { H3, Span } = Typography;

const projectMessage = <FormattedMessage {...messages.project} />;
const tabMessage = <FormattedMessage {...messages.tab} />;
const templateMessage = <FormattedMessage {...messages.template} />;
const blockTemplatesMessage = <FormattedMessage {...messages.blockTemplates} />;
const libraryMessage = <FormattedMessage {...messages.libraryMessage} />;

export const ProjectBreadcrumbs = ({ project }) => {
  const renderBreadcrumbs = () => {
    return (
      <Breadcrumbs>
        <LinkItem Component={Link} to={`/project/${project.id}/`}>
          <Span>{projectMessage}</Span>
          <H3>{project.title}</H3>
        </LinkItem>
        <LinkItem Component={Link} to={`/project/${project.id}/templates`}>
          <Span>{tabMessage}</Span>
          <H3>{templateMessage}</H3>
        </LinkItem>
        <LinkItem Component={Link} to={`/project/${project.id}/block-templates`} active>
          <Span>{libraryMessage}</Span>
          <H3>{blockTemplatesMessage}</H3>
        </LinkItem>
      </Breadcrumbs>
    );
  };
  return renderBreadcrumbs();
};

ProjectBreadcrumbs.propTypes = {
  project: PropTypes.object.isRequired,
};
