import React, { Fragment, PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ProjectTabs } from '../../shared/components/projectTabs';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import { getMatchParam } from '../../shared/utils/helpers';
import reportError from '../../shared/utils/reportError';
import { Edit } from './edit';
import { STATES } from '../../shared/components/projectTabs/projectTabs.constants';

export class ProjectState extends PureComponent {
  static propTypes = {
    fetchState: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
      params: PropTypes.shape({
        stateId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    error: null,
    loading: true,
  };

  async componentDidMount() {
    try {
      const stateId = getMatchParam(this.props, 'stateId');

      await this.props.fetchState({ stateId });
    } catch (error) {
      reportError(error);
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, error } = this.state;
    const {
      match: { path },
      state,
    } = this.props;
    const editPath = `${path}/edit`;

    return (
      <Fragment>
        <ProjectTabs active={STATES} url={`/project/${state.project}`} />
        <LoadingWrapper loading={loading} error={error}>
          <Switch>
            <Redirect exact path={path} to={editPath} />
            <Route exact path={editPath} component={Edit} />
          </Switch>
        </LoadingWrapper>
      </Fragment>
    );
  }
}
