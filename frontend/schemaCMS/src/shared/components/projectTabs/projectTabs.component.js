import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Tabs } from '../tabs';
import { Container } from './projectTabs.styles';
import { FOLDER, SETTINGS, SOURCES, USERS } from './projectTabs.constants';
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
      { id: FOLDER, to: `${url}/folder` },
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
