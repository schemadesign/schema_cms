import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Typography } from 'schemaUI';

import { Container, ListItemContent } from './directoryList.styles';
import messages from './directoryList.messages';
import { TopHeader } from '../../../shared/components/topHeader';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { DIRECTORY } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { ListContainer, ListItem } from '../../../shared/components/listComponents';
import { HeaderItem, HeaderList, titleStyles } from '../list/list.styles';
import { NoData } from '../../../shared/components/noData';
import { Link } from '../../../theme/typography';

const { H1 } = Typography;

export class DirectoryList extends PureComponent {
  static propTypes = {
    directories: PropTypes.array.isRequired,
    fetchDirectories: PropTypes.func.isRequired,
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
      await this.props.fetchDirectories({ projectId });
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ loading: false });
      this.props.history.push('/');
    }
  }

  getProjectId = () => path(['match', 'params', 'projectId'], this.props);

  handleCreateDirectory = () => this.props.history.push(`/project/${this.getProjectId()}/directory/create`);
  handleShowProject = () => this.props.history.push(`/project/${this.getProjectId()}`);
  handleShowDirectory = id => this.props.history.push(`/directory/${id}`);
  handleEditDirectory = id => this.props.history.push(`/directory/${id}/edit`);

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
    const header = this.renderHeader([whenCreated, `${firstName} ${lastName}`]);

    return (
      <ListItem key={index} headerComponent={header}>
        <ListItemContent>
          <H1 id={`directoryName-${index}`} customStyles={titleStyles} onClick={() => this.handleShowDirectory(id)}>
            {name}
          </H1>
          <Link onClick={() => this.handleEditDirectory(id)}>Edit directory</Link>
        </ListItemContent>
      </ListItem>
    );
  }

  renderList = list => <ListContainer>{list.map((item, index) => this.renderItem(item, index))}</ListContainer>;

  render() {
    const { loading } = this.state;
    const { match, directories } = this.props;

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
        <LoadingWrapper loading={loading} noData={!directories.length}>
          {this.renderList(directories)}
        </LoadingWrapper>
        <NavigationContainer hideOnDesktop>
          <BackArrowButton id="backBtn" onClick={this.handleShowProject} />
          <PlusButton id="createDirectoryBtn" onClick={this.handleCreateDirectory} />
        </NavigationContainer>
      </Container>
    );
  }
}
