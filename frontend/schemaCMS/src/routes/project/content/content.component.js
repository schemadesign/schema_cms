import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useParams } from 'react-router';
import { useEffectOnce } from 'react-use';

import { Container } from './content.styles';
import messages from './content.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { getProjectMenuOptions, PROJECT_CONTENT_ID } from '../project.constants';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { CONTENT } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';

export const Content = ({ userRole, fetchSections }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { projectId } = useParams();
  const intl = useIntl();
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(projectId);

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchSections({ projectId });
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  return (
    <Container>
      <Helmet title={intl.formatMessage(messages.title)} />
      <MobileMenu
        headerTitle={title}
        headerSubtitle={subtitle}
        options={filterMenuOptions(menuOptions, userRole)}
        active={PROJECT_CONTENT_ID}
      />
      <ProjectTabs active={CONTENT} url={`/project/${projectId}`} />
      <ContextHeader title={title} subtitle={subtitle} />
      <LoadingWrapper loading={loading} error={error}>
        sections
      </LoadingWrapper>
    </Container>
  );
};

Content.propTypes = {
  userRole: PropTypes.string.isRequired,
  fetchSections: PropTypes.func.isRequired,
  sections: PropTypes.array.isRequired,
};
