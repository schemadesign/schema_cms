import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { Typography } from 'schemaUI';

import { Container, PlusButtonWrapper } from './dataSourceStateList.styles';
import messages from './dataSourceStateList.messages';
import { getMatchParam } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { BackArrowButton, NavigationContainer, PlusButton } from '../../../shared/components/navigation';
import { Description, descriptionStyles, HeaderItem, HeaderList, titleStyles } from '../../project/list/list.styles';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { ListContainer, ListItem, ListItemTitle } from '../../../shared/components/listComponents';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';

const { P } = Typography;

export class DataSourceStateList extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string.isRequired,
    states: PropTypes.array.isRequired,
    fetchStates: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    dataSource: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
      }),
    }),
  };

  state = {
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const projectId = this.props.project.id;

      await this.props.fetchStates({ projectId });

      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleCreateState = () =>
    this.props.history.push(`/datasource/${getMatchParam(this.props, 'dataSourceId')}/state/create`);
  handleShowState = () => this.props.history.push(`/datasource/${getMatchParam(this.props, 'dataSourceId')}`);
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
    const { states, dataSource, match, history } = this.props;
    const { loading, error } = this.state;

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <ContextHeader
          title={<FormattedMessage {...messages.title} />}
          subtitle={<FormattedMessage {...messages.subTitle} />}
        >
          <DataSourceNavigation history={history} match={match} dataSource={dataSource} />
        </ContextHeader>
        <PlusButtonWrapper>
          <PlusButton id="createStateDesktopBtn" onClick={this.handleCreateState} />
        </PlusButtonWrapper>
        <LoadingWrapper
          loading={loading}
          error={error}
          noData={!states.length}
          noDataContent={<FormattedMessage {...messages.noData} />}
        >
          {this.renderList(states)}
        </LoadingWrapper>
        <NavigationContainer fixed hideOnDesktop>
          <BackArrowButton id="backBtn" onClick={this.handleShowState} />
          <PlusButton id="createStateBtn" onClick={this.handleCreateState} />
        </NavigationContainer>
      </Container>
    );
  }
}
