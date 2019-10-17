import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import { Typography, Card } from 'schemaUI';

import browserHistory from '../../../shared/utils/history';
import { Container } from './addUser.styles';
import { PlusButton } from '../../../shared/components/navigation';

const { H1 } = Typography;

export class AddUser extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    fetchUsers: PropTypes.func.isRequired,
    fetchProject: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
  };

  async componentDidMount() {
    try {
      await this.props.fetchProject({ projectId: path(['match', 'params', 'projectId'], this.props) });
      await this.props.fetchUsers();
    } catch (e) {
      browserHistory.push('/');
    }
  }

  handleAddUser = userId =>
    browserHistory.push(`/user/${userId}/add/${path(['match', 'params', 'projectId'], this.props)}`);

  renderUser = (user, index) => (
    <Card key={index}>
      <H1>{`${user.firstName} ${user.lastName}`}</H1>
      <PlusButton id={`addUserPlusButton${index}`} onClick={() => this.handleAddUser(user.id)} />
    </Card>
  );

  render() {
    const { users } = this.props;

    return <Container>{users.map(this.renderUser)}</Container>;
  }
}
