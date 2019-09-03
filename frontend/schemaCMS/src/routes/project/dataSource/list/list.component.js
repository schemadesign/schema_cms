import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Button, Header, Icons, Typography } from 'schemaUI';
import { addDataSourceStyles, Container } from './list.styles';

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
          <H2>Data Sources</H2>
          <H1>Overview</H1>
        </Header>
        <Button customStyles={addDataSourceStyles} onClick={this.handleCreateDataSource}>
          <Icons.PlusIcon />
        </Button>
      </Container>
    );
  }
}
