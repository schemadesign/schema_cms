import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs, LinkItem, Typography } from 'schemaUI';
import { FormattedMessage } from 'react-intl';

import { Link, ActiveItem, Container } from './projectBreadcrumbs.styles';
import messages from './projectBreadcrumbs.messages';
import { renderWhenTrueOtherwise } from '../../utils/rendering';

const { H3, Span } = Typography;

export const projectMessage = <FormattedMessage {...messages.project} />;
export const tabMessage = <FormattedMessage {...messages.tab} />;
export const templateMessage = <FormattedMessage {...messages.template} />;
export const templatesMessage = <FormattedMessage {...messages.templates} />;
export const blockTemplatesMessage = <FormattedMessage {...messages.blockTemplates} />;
export const libraryMessage = <FormattedMessage {...messages.libraryMessage} />;
export const createMessage = <FormattedMessage {...messages.createMessage} />;
export const pageTemplatesMessage = <FormattedMessage {...messages.pageTemplates} />;
export const filterTemplatesMessage = <FormattedMessage {...messages.filterTemplates} />;
export const stateTemplatesMessage = <FormattedMessage {...messages.stateTemplates} />;
export const sectionMessage = <FormattedMessage {...messages.section} />;
export const pageMessage = <FormattedMessage {...messages.page} />;
export const contentMessage = <FormattedMessage {...messages.content} />;
export const pageBlockMessage = <FormattedMessage {...messages.pageBlock} />;
export const tagsMessage = <FormattedMessage {...messages.tags} />;
export const tagsTemplateMessage = <FormattedMessage {...messages.tagsTemplate} />;
export const dataSourceMessage = <FormattedMessage {...messages.dataSource} />;
export const stateMessage = <FormattedMessage {...messages.state} />;

const BreadcrumbItem = ({ path = '', active = false, span = '', h3 = '' }, index) =>
  renderWhenTrueOtherwise(
    () => (
      <ActiveItem key={index}>
        <Span>{span}</Span>
        <H3>{h3}</H3>
      </ActiveItem>
    ),
    () => (
      <LinkItem
        key={index}
        render={styles => (
          <Link style={styles} to={path}>
            <Span>{span}</Span>
            <H3>{h3}</H3>
          </Link>
        )}
      />
    )
  )(active);

BreadcrumbItem.propTypes = {
  path: PropTypes.string,
  active: PropTypes.bool,
  span: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  h3: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export const ProjectBreadcrumbs = ({ items }) => {
  return (
    <Container>
      <Breadcrumbs>{items.map(BreadcrumbItem)}</Breadcrumbs>
    </Container>
  );
};

ProjectBreadcrumbs.propTypes = {
  items: PropTypes.array.isRequired,
};
