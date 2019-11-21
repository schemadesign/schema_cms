import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { always, cond, path, propEq, T } from 'ramda';
import { Typography } from 'schemaUI';

import { Container } from './directoryList.styles';
import messages from './directoryList.messages';
import { TopHeader } from '../../../shared/components/topHeader';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { DIRECTORY } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { Loader } from '../../../shared/components/loader';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { ListContainer, ListItem } from '../../../shared/components/listComponents';
import { HeaderItem, HeaderList, titleStyles } from '../list/list.styles';

const { H1 } = Typography;

export class DirectoryList extends PureComponent {
  static propTypes = {
    directories: PropTypes.array.isRequired,
    fetchList: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }),
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  };

  state = {
    loading: true,
  };

  async componentDidMount() {
    try {
      const projectId = this.getProjectId();
      await this.props.fetchList({ projectId });
      this.setState({ loading: false });
    } catch (e) {
      this.props.history.push('/');
    }
  }

  getProjectId = () => path(['match', 'params', 'projectId'], this.props);

  handleCreateDirectory = () => this.props.history.push(`/project/${this.getProjectId()}/create`);

  handleShowProject = () => this.props.history.push(`/project/${this.getProjectId()}`);

  handleShowDirectory = id => this.props.history.push(`/directory/${id}`);

  renderHeader = (list = []) => (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem id={`headerItem-${index}`} key={index}>
          {item}
        </HeaderItem>
      ))}
    </HeaderList>
  );

  renderItem({ id, name = '', created = '', createdBy = {} }, index) {
    const { firstName, lastName } = createdBy;
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
    const header = this.renderHeader([whenCreated, `${firstName}${lastName}`]);

    return (
      <ListItem key={index} headerComponent={header}>
        <H1 id={`projectName-${index}`} customStyles={titleStyles} onClick={() => this.handleShowDirectory(id)}>
          {name}
        </H1>
      </ListItem>
    );
  }

  renderList = ({ list }) => <ListContainer>{list.map((item, index) => this.renderItem(item, index))}</ListContainer>;

  renderContent = cond([
    [propEq('loading', true), always(<Loader />)],
    [propEq('list', []), this.renderNoData],
    [T, this.renderList],
  ]);

  render() {
    const { match, directories } = this.props;
    const { loading } = this.state;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ProjectTabs active={DIRECTORY} url={`/project/${match.params.projectId}`} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <PlusButton id="createDirectoryDesktopBtn" onClick={this.handleCreateDirectory} />
        </ContextHeader>
        {this.renderContent({ loading, list: directories })}
        <NavigationContainer hideOnDesktop>
          <BackArrowButton id="backBtn" onClick={this.handleShowProject} />
          <PlusButton id="createDirectoryBtn" onClick={this.handleCreateDataSource} />
        </NavigationContainer>
      </Container>
    );
  }
}
