import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Typography } from 'schemaUI';

import { Container } from './pageList.styles';
import messages from './pageList.messages';
import { TopHeader } from '../../../shared/components/topHeader';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { Description, HeaderItem, HeaderList, titleStyles } from '../../project/list/list.styles';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { ListContainer, ListItem } from '../../../shared/components/listComponents';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { Link } from '../../../theme/typography';
import {
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
} from '../../../shared/components/listComponents/listItem.styles';

const { P } = Typography;

export class PageList extends PureComponent {
  static propTypes = {
    fetchPages: PropTypes.func.isRequired,
    fetchFolder: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
    pages: PropTypes.array.isRequired,
    folder: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        folderId: PropTypes.string.isRequired,
      }),
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const folderId = this.getFolderId();
      await this.props.fetchFolder({ folderId });
      await this.props.fetchPages({ folderId });

      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  }

  getFolderId = () => path(['match', 'params', 'folderId'], this.props);
  getProjectId = () => path(['folder', 'project'], this.props);
  handleEditPage = id => this.props.history.push(`/page/${id}/edit`);

  handleCreatePage = () => this.props.history.push(`/folder/${this.getFolderId()}/page`);

  handleShowFolderList = () => this.props.history.push(`/project/${this.getProjectId()}/folder`);

  handleShowPage = id => this.props.history.push(`/page/${id}`);

  renderHeader = (list = []) => (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem id={`headerItem-${index}`} key={index}>
          {item}
        </HeaderItem>
      ))}
    </HeaderList>
  );

  renderItem({ id, title = '', created = '', createdBy = {}, description = '', meta = {} }, index) {
    const { firstName, lastName } = createdBy;
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
    const header = this.renderHeader([whenCreated, `${firstName} ${lastName}`]);
    const footer = <FormattedMessage values={{ length: meta.blocks }} {...messages.blocks} />;

    return (
      <ListItem key={index} headerComponent={header} footerComponent={footer}>
        <ListItemContent>
          <ListItemDescription>
            <ListItemTitle id={`pageTitle-${index}`} customStyles={titleStyles} onClick={() => this.handleShowPage(id)}>
              {title}
            </ListItemTitle>
            <Description onClick={() => this.handleShowPage(id)}>
              <P id={`pageDescription-${index}`}>{description}</P>
            </Description>
          </ListItemDescription>
          <Link onClick={() => this.handleEditPage(id)}>Edit Page</Link>
        </ListItemContent>
      </ListItem>
    );
  }

  renderContent = list => <ListContainer>{list.map((item, index) => this.renderItem(item, index))}</ListContainer>;

  render() {
    const { pages } = this.props;
    const { loading, error } = this.state;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <PlusButton id="createPageDesktopBtn" onClick={this.handleCreatePage} />
        </ContextHeader>
        <LoadingWrapper loading={loading} error={error} noData={!pages.length}>
          {this.renderContent(pages)}
        </LoadingWrapper>
        <NavigationContainer>
          <BackArrowButton id="backBtn" onClick={this.handleShowFolderList} />
          <PlusButton hideOnDesktop id="createPageBtn" onClick={this.handleCreatePage} />
        </NavigationContainer>
      </Container>
    );
  }
}