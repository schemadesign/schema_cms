import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Tabs } from '../tabs';
import { Container } from './projectTabs.styles';
import { CONTENT, SETTINGS, SOURCES, USERS, TEMPLATES, TAG_CATEGORIES } from './projectTabs.constants';
import messages from './projectTabs.messages';
import { UserContext } from '../../utils/userProvider';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { filterMenuOptions } from '../../utils/helpers';

export const ProjectTabs = ({ active, url }) => {
  const { role } = useContext(UserContext);
  const generateTabs = (active, url) => {
    const tabs = [
      { id: SETTINGS, to: url, allowedRoles: [ROLES.ADMIN, ROLES.EDITOR] },
      { id: SOURCES, to: `${url}/datasource`, allowedRoles: [ROLES.ADMIN, ROLES.EDITOR] },
      { id: TAG_CATEGORIES, to: `${url}/tag-categories`, allowedRoles: [ROLES.ADMIN] },
      { id: CONTENT, to: `${url}/content`, allowedRoles: [ROLES.ADMIN, ROLES.EDITOR] },
      { id: TEMPLATES, to: `${url}/templates`, allowedRoles: [ROLES.ADMIN] },
      { id: USERS, to: `${url}/user`, allowedRoles: [ROLES.ADMIN, ROLES.EDITOR] },
    ];
    const filteredTabs = filterMenuOptions(tabs, role);

    return filteredTabs.map(item => ({
      ...item,
      active: item.id === active,
      content: <FormattedMessage {...messages[item.id]} />,
    }));
  };

  return (
    <Container id="tabsContainer">
      <Tabs tabs={generateTabs(active, url)} />
    </Container>
  );
};

ProjectTabs.propTypes = {
  active: PropTypes.string,
  url: PropTypes.string,
};
