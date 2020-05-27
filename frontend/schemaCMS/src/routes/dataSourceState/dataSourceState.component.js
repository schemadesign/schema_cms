import React, { Fragment, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useParams, useRouteMatch } from 'react-router';
import { useEffectOnce } from 'react-use';

import { LoadingWrapper } from '../../shared/components/loadingWrapper';
import reportError from '../../shared/utils/reportError';
import { StateFilter } from './stateFilter';
import { EditState } from './editState';
import { NotFound } from '../notFound';
import { ProjectTabs } from '../../shared/components/projectTabs';
import { SOURCES } from '../../shared/components/projectTabs/projectTabs.constants';

export const DataSourceState = ({ fetchState, project }) => {
  const { path } = useRouteMatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { stateId } = useParams();
  const filterPath = `${path}/filter/:filterId`;

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchState({ stateId });
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  return (
    <Fragment>
      <ProjectTabs active={SOURCES} url={`/project/${project.id}`} />
      <LoadingWrapper loading={loading} error={error}>
        <Switch>
          <Route exact path={path} component={EditState} />
          <Route exact path={filterPath} component={StateFilter} />
          <Route exact path={`${path}/*`} component={NotFound} />
        </Switch>
      </LoadingWrapper>
    </Fragment>
  );
};

DataSourceState.propTypes = {
  fetchState: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};
