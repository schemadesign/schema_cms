import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs, LinkItem, Typography } from 'schemaUI';
import { useIntl } from 'react-intl';
import { is, identity, ifElse } from 'ramda';

import { Link, ActiveItem, Container, Title } from './projectBreadcrumbs.styles';
import messages from './projectBreadcrumbs.messages';
import { renderWhenTrueOtherwise } from '../../utils/rendering';

const { Span } = Typography;

export const projectMessage = messages.project;
export const tabMessage = messages.tab;
export const templateMessage = messages.template;
export const templatesMessage = messages.templates;
export const blockTemplatesMessage = messages.blockTemplates;
export const libraryMessage = messages.libraryMessage;
export const createMessage = messages.createMessage;
export const pageTemplatesMessage = messages.pageTemplates;
export const filterTemplatesMessage = messages.filterTemplates;
export const stateTemplatesMessage = messages.stateTemplates;
export const sectionMessage = messages.section;
export const pageMessage = messages.page;
export const contentMessage = messages.content;
export const pageBlockMessage = messages.pageBlock;
export const tagsMessage = messages.tags;
export const tagsTemplateMessage = messages.tagsTemplate;
export const dataSourceMessage = messages.dataSource;
export const stateMessage = messages.state;

const BreadcrumbItem = ({ path = '', active = false, span = '', h3 = '' }, index) => {
  const { formatMessage } = useIntl();
  const getCopy = ifElse(is(String), identity, message => formatMessage(message));
  const title = getCopy(h3);
  const header = getCopy(span);

  return renderWhenTrueOtherwise(
    () => (
      <ActiveItem key={index}>
        <Span>{header}</Span>
        <Title title={title}>{title}</Title>
      </ActiveItem>
    ),
    () => (
      <LinkItem
        key={index}
        render={styles => (
          <Link style={styles} to={path}>
            <Span>{header}</Span>
            <Title title={title}>{title}</Title>
          </Link>
        )}
      />
    )
  )(active);
};

BreadcrumbItem.propTypes = {
  path: PropTypes.string,
  active: PropTypes.bool,
  span: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  h3: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export const ProjectBreadcrumbs = ({ items }) => (
  <Container>
    <Breadcrumbs>{items.map(BreadcrumbItem)}</Breadcrumbs>
  </Container>
);

ProjectBreadcrumbs.propTypes = {
  items: PropTypes.array.isRequired,
};
