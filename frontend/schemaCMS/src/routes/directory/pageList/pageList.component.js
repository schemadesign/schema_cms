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

const { H1, P } = Typography;

export class PageList extends PureComponent {
  static propTypes = {
    fetchPages: PropTypes.func.isRequired,
    fetchDirectory: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    pages: PropTypes.array.isRequired,
    directory: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        directoryId: PropTypes.string.isRequired,
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
      const directoryId = this.getDirectoryId();
      await this.props.fetchDirectory({ directoryId });
      await this.props.fetchPages({ directoryId });

      this.setState({ loading: false });
    } catch (e) {
      this.props.history.push('/');
    }
  }

  getDirectoryId = () => path(['match', 'params', 'directoryId'], this.props);
  getProjectId = () => path(['directory', 'project'], this.props);

  handleCreatePage = () => this.props.history.push(`/directory/${this.getDirectoryId()}/page/create`);

  handleShowDirectoryList = () => this.props.history.push(`/project/${this.getProjectId()}/directory`);

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

  renderItem({ id, name = '', created = '', createdBy = {}, description, metaData }, index) {
    const { firstName, lastName } = createdBy;
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();
    const header = this.renderHeader([whenCreated, `${firstName} ${lastName}`]);
    const footer = <FormattedMessage values={{ length: metaData.blocks }} {...messages.blocks} />;

    return (
      <ListItem key={index} headerComponent={header} footerComponent={footer}>
        <H1 id={`pageName-${index}`} customStyles={titleStyles} onClick={() => this.handleShowPage(id)}>
          {name}
        </H1>
        <Description onClick={() => this.handleShowPage(id)}>
          <P id={`pageDescription-${index}`}>{description}</P>
        </Description>
      </ListItem>
    );
  }

  renderContent = list => <ListContainer>{list.map((item, index) => this.renderItem(item, index))}</ListContainer>;

  render() {
    const { pages } = this.props;
    const { loading } = this.state;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <TopHeader headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <PlusButton id="createPageDesktopBtn" onClick={this.handleCreatePage} />
        </ContextHeader>
        <LoadingWrapper loading={loading} noData={!pages.length}>
          {this.renderContent(pages)}
        </LoadingWrapper>
        <NavigationContainer hideOnDesktop>
          <BackArrowButton id="backBtn" onClick={this.handleShowDirectoryList} />
          <PlusButton id="createPageBtn" onClick={this.handleCreatePage} />
        </NavigationContainer>
      </Container>
    );
  }
}
