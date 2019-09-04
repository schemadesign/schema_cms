import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button, Header, Icons, Typography } from 'schemaUI';
import { addDataSourceStyles, Container } from './list.styles';
import messages from './list.messages';

const { H1, H2 } = Typography;

export class List extends PureComponent {
  static propTypes = {
    createDataSource: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  handleCreateDataSource = () => {
    const projectId = this.props.match.params.projectId;

    this.props.createDataSource({ projectId });
  };

  render() {
    return (
      <Container>
        <Header onButtonClick={this.handleToggleMenu}>
          <H2>
            <FormattedMessage {...messages.title} />
          </H2>
          <H1>
            <FormattedMessage {...messages.subTitle} />
          </H1>
        </Header>
        <Button customStyles={addDataSourceStyles} onClick={this.handleCreateDataSource}>
          <Icons.PlusIcon />
        </Button>
      </Container>
    );
  }
}
