import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { Typography } from 'schemaUI';

import { Container } from './dataSourceStateList.styles';
import messages from './dataSourceStateList.messages';
import { filterMenuOptions, getMatchParam } from '../../../shared/utils/helpers';
import reportError from '../../../shared/utils/reportError';
import { LoadingWrapper } from '../../../shared/components/loadingWrapper';
import { ContextHeader } from '../../../shared/components/contextHeader';
import { PlusButton } from '../../../shared/components/navigation';
import { Description, descriptionStyles, HeaderItem, HeaderList, titleStyles } from '../../project/list/list.styles';
import extendedDayjs, { BASE_DATE_FORMAT } from '../../../shared/utils/extendedDayjs';
import { ListContainer, ListItem, ListItemTitle } from '../../../shared/components/listComponents';
import { DataSourceNavigation } from '../../../shared/components/dataSourceNavigation';
import { MobileMenu } from '../../../shared/components/menu/mobileMenu';
import { getProjectMenuOptions } from '../../project/project.constants';
import { CounterHeader } from '../../../shared/components/counterHeader';
import { mobilePlusStyles, PlusContainer } from '../../../shared/components/form/frequentComponents.styles';

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
      const dataSourceId = this.props.dataSource.id;

      await this.props.fetchStates({ dataSourceId });

      this.setState({ loading: false });
    } catch (error) {
      reportError(error);
      this.setState({ loading: false, error });
    }
  }

  handleCreateState = () =>
    this.props.history.push(`/datasource/${getMatchParam(this.props, 'dataSourceId')}/state/create`);
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
    const { states, dataSource, match, history, userRole, project, intl } = this.props;
    const { loading, error } = this.state;
    const headerTitle = <FormattedMessage {...messages.title} />;
    const headerSubtitle = <FormattedMessage {...messages.subTitle} />;
    const menuOptions = getProjectMenuOptions(project.id);
    const stateCopy = intl.formatMessage(messages.state);

    return (
      <Container>
        <Helmet title={this.props.intl.formatMessage(messages.title)} />
        <MobileMenu
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          options={filterMenuOptions(menuOptions, userRole)}
        />
        <ContextHeader title={headerTitle} subtitle={headerSubtitle}>
          <DataSourceNavigation history={history} match={match} dataSource={dataSource} />
        </ContextHeader>
        <CounterHeader
          count={states.length}
          copy={stateCopy}
          right={
            <PlusContainer>
              <PlusButton
                id="createStateDesktopBtn"
                customStyles={mobilePlusStyles}
                onClick={this.handleCreateState}
                type="button"
              />
            </PlusContainer>
          }
        />
        <LoadingWrapper
          loading={loading}
          error={error}
          noData={!states.length}
          noDataContent={<FormattedMessage {...messages.noData} />}
        >
          {this.renderList(states)}
        </LoadingWrapper>
        <DataSourceNavigation hideOnDesktop history={history} match={match} dataSource={dataSource} />
      </Container>
    );
  }
}
