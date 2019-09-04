import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose, omit } from 'ramda';
import { withFormik } from 'formik';
import { injectIntl } from 'react-intl';

import { View } from './view.component';
import { DataSourceRoutines, selectDataSource } from '../../../../modules/dataSource';
import {
  DATA_SOURCE_SCHEMA,
  UPDATE_DATA_SOURCE_FORM,
  OMIT_FIELDS,
} from '../../../../modules/dataSource/dataSource.constants';

const mapStateToProps = createStructuredSelector({
  dataSource: selectDataSource,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchDataSource: promisifyRoutine(DataSourceRoutines.fetchOne),
      updateDataSource: promisifyRoutine(DataSourceRoutines.updateOne),
      unmountDataSource: promisifyRoutine(DataSourceRoutines.unmountOne),
    },
    dispatch
  ),
});

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl,
  withRouter,
  withFormik({
    displayName: UPDATE_DATA_SOURCE_FORM,
    enableReinitialize: true,
    isInitialValid: true,
    mapPropsToValues: ({ dataSource }) => omit(OMIT_FIELDS, dataSource),
    validationSchema: () => DATA_SOURCE_SCHEMA,
    handleSubmit: async (requestData, { props, ...formik }) => {
      try {
        const { projectId, dataSourceId, step } = props.match.params;
        await props.updateDataSource({ requestData, projectId, dataSourceId, step });

        formik.setSubmitting(true);
      } catch ({ errors }) {
        formik.setErrors(errors);
      } finally {
        formik.setSubmitting(false);
      }
    },
  })
)(View);
