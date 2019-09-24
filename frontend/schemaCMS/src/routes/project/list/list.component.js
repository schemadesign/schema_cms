import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { isEmpty } from 'ramda';
import { Button, Card, Icons, Typography } from 'schemaUI';

import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { generateApiUrl } from '../../../shared/utils/helpers';
import { TopHeader } from '../../../shared/components/topHeader';
import { Empty } from '../project.styles';
import messages from './list.messages';
import {
  Container,
  Description,
  HeaderItem,
  HeaderList,
  ProjectItem,
  ProjectsList,
  urlStyles,
  titleStyles,
  addProjectStyles,
} from './list.styles';

const { H1, P, Span } = Typography;

export class List extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    fetchProjectsList: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.fetchProjectsList();
  }

  getHeaderAndMenuConfig = () => ({
    headerTitle: this.formatMessage(messages.title),
    headerSubtitle: this.formatMessage(messages.overview),
    secondaryMenuItems: [{ label: this.formatMessage(messages.logOut), to: '/logout', id: 'logoutBtn' }],
  });

  formatMessage = value => this.props.intl.formatMessage(value);

  handleShowProject = id => () => this.props.history.push(`/project/view/${id}`);

  handleNewProject = () => this.props.history.push('/project/create/');

  renderHeader = (list = []) => (
    <HeaderList>
      {list.map((item, index) => (
        <HeaderItem id={`headerItem-${index}`} key={index}>
          {item}
        </HeaderItem>
      ))}
    </HeaderList>
  );

  renderItem({ id, title = '', description = '', slug = '', created = '', status = '', owner = {} }, index) {
    const { firstName = '', lastName = '' } = owner;
    const user = isEmpty(firstName) ? lastName : `${firstName} ${lastName}`;
    const whenCreated = extendedDayjs(created, BASE_DATE_FORMAT).fromNow();

    const statusValue = messages[status] ? this.formatMessage(messages[status]) : status;

    const header = this.renderHeader([whenCreated, statusValue, user]);
    const handleShowProject = this.handleShowProject(id);

    return (
      <ProjectItem key={index}>
        <Card headerComponent={header}>
          <H1 id={`projectName-${index}`} customStyles={titleStyles} onClick={handleShowProject}>
            {title}
          </H1>
          <Description onClick={handleShowProject}>
            <P id={`projectDescription-${index}`}>{description}</P>
          </Description>
          <Span id={`apiPath-${index}`} customStyles={urlStyles}>
            {generateApiUrl(slug)}
          </Span>
        </Card>
      </ProjectItem>
    );
  }

  renderList = (_, list) => <ProjectsList>{list.map((item, index) => this.renderItem(item, index))}</ProjectsList>;

  renderNoData = () => (
    <Empty>
      <P>{this.props.intl.formatMessage(messages.noProjects)} </P>
    </Empty>
  );

  render() {
    const { list = [] } = this.props;

    const topHeaderConfig = this.getHeaderAndMenuConfig();
    const content = renderWhenTrueOtherwise(this.renderList, this.renderNoData)(Boolean(list.length), list);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.pageTitle)} />
        <TopHeader {...topHeaderConfig} />
        {content}
        <Button id="addProjectBtn" customStyles={addProjectStyles} onClick={this.handleNewProject}>
          <Icons.PlusIcon />
        </Button>
      </Container>
    );
  }
}
