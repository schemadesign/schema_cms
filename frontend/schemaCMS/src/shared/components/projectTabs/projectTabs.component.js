import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Tabs } from '../tabs';
import { Container } from './projectTabs.styles';
import { CONTENT, SETTINGS, SOURCES, USERS, STATES, TEMPLATES } from './projectTabs.constants';
import messages from './projectTabs.messages';

export class ProjectTabs extends PureComponent {
  static propTypes = {
    active: PropTypes.string,
    url: PropTypes.string,
  };

  generateTabs = (active, url) => {
    const tabs = [
      { id: SETTINGS, to: url },
      { id: SOURCES, to: `${url}/datasource` },
      { id: STATES, to: `${url}/state` },
      { id: CONTENT, to: `${url}/content` },
      { id: TEMPLATES, to: `${url}/templates` },
      { id: USERS, to: `${url}/user` },
    ];

    return tabs.map(item => ({
      ...item,
      active: item.id === active,
      content: <FormattedMessage {...messages[item.id]} />,
    }));
  };

  render() {
    const { active, url } = this.props;
    const tabs = this.generateTabs(active, url);

    return (
      <Container id="tabsContainer">
        <Tabs tabs={tabs} />
      </Container>
    );
  }
}
