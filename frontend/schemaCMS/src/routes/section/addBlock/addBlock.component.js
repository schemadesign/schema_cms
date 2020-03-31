import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router';
import Helmet from 'react-helmet';

import { Container } from './addBlock.styles';
import messages from './addBlock.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { getProjectMenuOptions } from '../../project/project.constants';
import { AddBlockForm } from '../../../shared/components/addBlockForm';

export const AddBlock = ({ fetchBlockTemplates, project, userRole, blockTemplates }) => {
  const intl = useIntl();
  const { sectionId } = useParams();
  const projectId = project.id;
  const title = intl.formatMessage(messages.title);
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(projectId);

  return (
    <Container>
      <Helmet title={title} />
      <MobileMenu headerTitle={title} headerSubtitle={subtitle} options={filterMenuOptions(menuOptions, userRole)} />
      <AddBlockForm
        fetchBlockTemplates={fetchBlockTemplates}
        projectId={projectId}
        blockTemplates={blockTemplates}
        backUrl={`/section/${sectionId}/create-page`}
        title={title}
      />
    </Container>
  );
};

AddBlock.propTypes = {
  fetchBlockTemplates: PropTypes.func.isRequired,
  blockTemplates: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  userRole: PropTypes.string.isRequired,
};
