import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { Typography } from 'schemaUI';

import { Container } from './projectStateList.styles';
import messages from './projectStateList.messages';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions, PROJECT_STATE_ID } from '../project.constants';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { STATES } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { Description, descriptionStyles, HeaderItem, HeaderList, titleStyles } from '../list/list.styles';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { ListContainer, ListItem, ListItemTitle } from '../../../shared/components/listComponents';

const { P } = Typography;

export class ProjectStateList extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    states: PropTypes.array.isRequired,
    fetchStates: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }),
    }),
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const projectId = getMatchParam(this.props, 'projectId');

      await this.props.fetchStates({ projectId });

      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleCreateState = () => this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}/state/create`);
  handleShowProject = () => this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}`);
  handleShowState = id => this.props.history.push(`/state/${id}`);

  renderHeader = (list = []) => (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem id={`headerItem-${index}`} key={index}>
          {item}
        </HeaderItem>
      ))}
    </HeaderList>
  );

  renderItem({ id, name = '', description = '', created = '', author }, index) {
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
    const header = this.renderHeader([whenCreated, author || '—']);

    return (
      <ListItem key={index} headerComponent={header}>
        <ListItemTitle id={`stateName-${index}`} customStyles={titleStyles} onClick={() => this.handleShowState(id)}>
          {name}
        </ListItemTitle>
        <Description onClick={() => this.handleShowState(id)} customStyles={descriptionStyles}>
          <P id={`projectDescription-${index}`}>{description}</P>
        </Description>
      </ListItem>
    );
  }

  renderList = list => <ListContainer>{list.map((item, index) => this.renderItem(item, index))}</ListContainer>;

  render() {
    const { states, userRole, match } = this.props;
    const { loading, error } = this.state;
    const projectId = getMatchParam(this.props, 'projectId');
    const menuOptions = getProjectMenuOptions(projectId);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <MobileMenu
          headerTitle={<FormattedMessage {...messages.title} />}
          headerSubtitle={<FormattedMessage {...messages.subTitle} />}
          options={filterMenuOptions(menuOptions, userRole)}
          active={PROJECT_STATE_ID}
        />
        <ProjectTabs active={STATES} url={`/project/${match.params.projectId}`} />
        <ContextHeader
          title={<FormattedMessage {...messages.title} />}
          subtitle={<FormattedMessage {...messages.subTitle} />}
        >
          <PlusButton id="createStateDesktopBtn" onClick={this.handleCreateState} />
        </ContextHeader>
        <LoadingWrapper loading={loading} error={error} noData={!states.length}>
          {this.renderList(states)}
        </LoadingWrapper>
        <NavigationContainer fixed hideOnDesktop>
          <BackArrowButton id="backBtn" onClick={this.handleShowProject} />
          <PlusButton id="createStateBtn" onClick={this.handleCreateState} />
        </NavigationContainer>
      </Container>
    );
  }
}
