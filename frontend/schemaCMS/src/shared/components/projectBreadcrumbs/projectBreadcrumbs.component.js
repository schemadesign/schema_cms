import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs, LinkItem, Typography } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import { Link } from './projectBreadcrumbs.styles';
import messages from './projectBreadcrumbs.messages';

const { H3, Span } = Typography;

export const projectMessage = <FormattedMessage {...messages.project} />;
export const tabMessage = <FormattedMessage {...messages.tab} />;
export const templateMessage = <FormattedMessage {...messages.template} />;
export const templatesMessage = <FormattedMessage {...messages.templates} />;
export const blockTemplatesMessage = <FormattedMessage {...messages.blockTemplates} />;
export const libraryMessage = <FormattedMessage {...messages.libraryMessage} />;
export const createMessage = <FormattedMessage {...messages.createMessage} />;

export const ProjectBreadcrumbs = ({ items }) => {
  const getBreadcrumbsItem = (item, index) => {
    const { path = '', active = false, span = '', h3 = '' } = item;

    return (
      <LinkItem key={index} Component={Link} to={path} active={active}>
        <Span>{span}</Span>
        <H3>{h3}</H3>
      </LinkItem>
    );
  };

  return <Breadcrumbs>{items.map(getBreadcrumbsItem)}</Breadcrumbs>;
};

ProjectBreadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      active: PropTypes.bool,
      span: PropTypes.element,
      h3: PropTypes.element,
    })
  ),
};
