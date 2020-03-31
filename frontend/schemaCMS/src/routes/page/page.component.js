import React, { Fragment, useState } from 'react';
import { Route, Switch, useRouteMatch, useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import PropTypes from 'prop-types';

import { EditPage } from './editPage';
import { NotFound } from '../notFound';
import { AddBlock } from './addBlock';
import reportError from '../../shared/utils/reportError';
import { LoadingWrapper } from '../../shared/components/loadingWrapper';

export const Page = ({ fetchPage }) => {
  const { path } = useRouteMatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pageId } = useParams();
  const addBlockPath = `${path}/add-block`;

  useEffectOnce(() => {
    (async () => {
      try {
        await fetchPage({ pageId });
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
      <LoadingWrapper loading={loading} error={error}>
        <Switch>
          <Route exact path={path} component={EditPage} />
          <Route exact path={addBlockPath} component={AddBlock} />
          <Route exact path={`${path}/*`} component={NotFound} />
        </Switch>
      </LoadingWrapper>
    </Fragment>
  );
};

Page.propTypes = {
  fetchPage: PropTypes.func.isRequired,
};
