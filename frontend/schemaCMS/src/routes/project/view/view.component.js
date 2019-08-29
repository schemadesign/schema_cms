import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Header, Typography } from 'schemaUI';
import { isEmpty, path } from 'ramda';

import { renderWhenTrueOtherwise } from '../../../shared/utils/rendering';
import { Container, Empty, headerStyles } from '../list/list.styles';

const { H1, H2, P } = Typography;

export class View extends PureComponent {
  static propTypes = {
    project: PropTypes.object.isRequired,
    fetchProject: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  componentDidMount() {
    this.props.fetchProject(this.props.match.params.id);
  }

  renderProject = (_, project = {}) => <P>{project.description}</P>;

  renderNoData = () => (
    <Empty>
      <P>Project doesn't exist.</P>
    </Empty>
  );

  render() {
    const { project } = this.props;
    const title = path(['title'], project, '');

    const content = renderWhenTrueOtherwise(this.renderNoData, this.renderProject)(isEmpty(project), project);

    return (
      <Container>
        <Header customStyles={headerStyles}>
          <H2>Project</H2>
          <H1>{title}</H1>
        </Header>
        {content}
      </Container>
    );
  }
}
