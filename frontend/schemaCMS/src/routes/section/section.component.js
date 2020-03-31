import React, { useState } from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router';
import { useEffectOnce } from 'react-use';
import PropTypes from 'prop-types';

import { NotFound } from '../notFound';
import { PageList } from './pageList';
import { CreatePage } from './createPage';
import { AddBlock } from './addBlock';
import reportError from '../../shared/utils/reportError';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';

export const Section = ({ fetchSection }) => {
  const { path } = useRouteMatch();
  const createPagePath = `${path}/create-page`;
  const addBlockPath = `${createPagePath}/add-block`;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { sectionId } = useParams();

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchSection({ sectionId });
      } catch (e) {
        reportError(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  });

  return (
    <LoadingWrapper loading={loading} error={error}>
      <Switch>
        <Route exact path={path} component={PageList} />
        <Route exact path={createPagePath} component={CreatePage} />
        <Route exact path={addBlockPath} component={AddBlock} />
        <Route path="*" component={NotFound} />
      </Switch>
    </LoadingWrapper>
  );
};

Section.propTypes = {
  fetchSection: PropTypes.func.isRequired,
};
