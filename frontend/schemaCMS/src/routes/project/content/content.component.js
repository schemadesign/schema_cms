import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useHistory, useParams } from 'react-router';
import { useEffectOnce } from 'react-use';

import { Container, CardHeaderIcons } from './content.styles';
import messages from './content.messages';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { filterMenuOptions } from '../../../shared/utils/helpers';
import { getProjectMenuOptions, PROJECT_CONTENT_ID } from '../project.constants';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { CONTENT } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { CardHeader } from '../../../shared/components/cardHeader';
import { ListContainer, ListItem, ListItemTitle } from '../../../shared/components/listComponents';
import { CounterHeader } from '../../../shared/components/counterHeader';
import reportError from '../../../shared/utils/reportError';
import { NavigationContainer, BackLink } from '../../../shared/components/navigation';
import { PlusLinkWithText } from '../../../shared/components/navigation/navigation.component';
import { DotsMenu } from '../../../shared/components/dotsMenu';

const Section = ({ created, createdBy, name, id, pagesCount = 0, removeSection }) => {
  const intl = useIntl();
  const history = useHistory();

  const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
  const list = [whenCreated, createdBy];

  const getDotsMenuOptions = id => [
    {
      label: intl.formatMessage(messages.dotsMenuEdit),
      onClick: () => {
        history.push(`/section/${id}`);
      },
    },
    {
      label: intl.formatMessage(messages.dotsMenuDelete),
      onClick: () => removeSection(id),
    },
  ];
  const header = (
    <CardHeader
      list={list}
      icon={
        <CardHeaderIcons>
          <DotsMenu options={getDotsMenuOptions(id)} />
        </CardHeaderIcons>
      }
    />
  );
  const footer = <FormattedMessage {...messages.pagesCounter} values={{ pagesCount }} />;

  return (
    <ListItem headerComponent={header} footerComponent={footer}>
      <ListItemTitle id={`section-${id}`} to={`/section/${id}`}>
        {name}
      </ListItemTitle>
    </ListItem>
  );
};

Section.propTypes = {
  created: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  pagesCount: PropTypes.number.isRequired,
  removeSection: PropTypes.func.isRequired,
};

export const Content = ({ userRole, fetchSections, removeSection, sections }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const intl = useIntl();
  const title = <FormattedMessage {...messages.title} />;
  const subtitle = <FormattedMessage {...messages.subtitle} />;
  const menuOptions = getProjectMenuOptions(projectId);

  const removeSectionAndRefresh = async sectionId => {
    await removeSection({ sectionId });
    await fetchSections({ projectId });
  };

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchSections({ projectId });
      } catch (e) {
        reportError(e);
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
      <ContextHeader title={title} subtitle={subtitle}>
        <PlusLinkWithText
          id="createSection"
          text={intl.formatMessage(messages.addBlockButton)}
          to={`/project/${projectId}/section/create`}
        />
      </ContextHeader>
      <LoadingWrapper loading={loading} error={error}>
        <Fragment>
          <CounterHeader moveToTop copy={intl.formatMessage(messages.section)} count={sections.length} />
          <ListContainer>
            {sections.map((section, index) => (
              <Section key={index} removeSection={removeSectionAndRefresh} {...section} />
            ))}
          </ListContainer>
        </Fragment>
      </LoadingWrapper>
      <NavigationContainer fixed>
        <BackLink id="backBtn" to={`/project/${projectId}`} />
        <PlusLinkWithText
          id="createSection"
          text={intl.formatMessage(messages.addBlockButton)}
          to={`/project/${projectId}/section/create`}
          hideOnDesktop
        />
      </NavigationContainer>
    </Container>
  );
};

Content.propTypes = {
  userRole: PropTypes.string.isRequired,
  fetchSections: PropTypes.func.isRequired,
  removeSection: PropTypes.func.isRequired,
  sections: PropTypes.array.isRequired,
};
