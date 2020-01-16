import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import { Container } from './folderList.styles';
import messages from './folderList.messages';
import { ProjectTabs } from '../../../shared/components/projectTabs';
import { FOLDER } from '../../../shared/components/projectTabs/projectTabs.constants';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { ListContainer, ListItem } from '../../../shared/components/listComponents';
import { HeaderItem, HeaderList, titleStyles } from '../list/list.styles';
import { Link } from '../../../theme/typography';
import { getMatchParam, filterMenuOptions } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';

import { ListItemTitle, ListItemContent } from '../../../shared/components/listComponents/listItem.styles';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions, PROJECT_FOLDER_ID } from '../project.constants';

export class FolderList extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string,
    folders: PropTypes.array.isRequired,
    fetchFolders: PropTypes.func.isRequired,
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
      const projectId = getMatchParam(this.props, 'projectId');

      await this.props.fetchFolders({ projectId });
      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleCreateFolder = () =>
    this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}/folder/create`);
  handleShowProject = () => this.props.history.push(`/project/${getMatchParam(this.props, 'projectId')}`);
  handleShowFolder = id => this.props.history.push(`/folder/${id}`);
  handleEditFolder = id => this.props.history.push(`/folder/${id}/edit`);

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
          <ListItemTitle
            id={`folderName-${index}`}
            customStyles={titleStyles}
            onClick={() => this.handleShowFolder(id)}
          >
            {name}
          </ListItemTitle>
          <Link onClick={() => this.handleEditFolder(id)}>Edit folder</Link>
        </ListItemContent>
      </ListItem>
    );
  }

  renderList = list => <ListContainer>{list.map((item, index) => this.renderItem(item, index))}</ListContainer>;

  render() {
    const { loading, error } = this.state;
    const { match, folders, userRole } = this.props;
    const projectId = getMatchParam(this.props, 'projectId');
    const menuOptions = getProjectMenuOptions(projectId);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <MobileMenu
          headerTitle={<FormattedMessage {...messages.title} />}
          headerSubtitle={<FormattedMessage {...messages.subTitle} />}
          options={filterMenuOptions(menuOptions, userRole)}
          active={PROJECT_FOLDER_ID}
        />
        <ProjectTabs active={FOLDER} url={`/project/${match.params.projectId}`} />
        <ContextHeader
          title={<FormattedMessage {...messages.title} />}
          subtitle={<FormattedMessage {...messages.subTitle} />}
        >
          <PlusButton id="createFolderDesktopBtn" onClick={this.handleCreateFolder} />
        </ContextHeader>
        <LoadingWrapper
          loading={loading}
          error={error}
          noData={!folders.length}
          noDataContent={this.props.intl.formatMessage(messages.noFolders)}
        >
          {this.renderList(folders)}
        </LoadingWrapper>
        <NavigationContainer fixed hideOnDesktop>
          <BackArrowButton id="backBtn" onClick={this.handleShowProject} />
          <PlusButton id="createFolderBtn" onClick={this.handleCreateFolder} />
        </NavigationContainer>
      </Container>
    );
  }
}
