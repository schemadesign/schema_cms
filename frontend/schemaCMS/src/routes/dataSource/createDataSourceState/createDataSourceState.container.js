import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { CreateDataSourceState } from './createDataSourceState.component';
import { selectUserRole } from '../../../modules/userProfile';
import { DataSourceRoutines, selectDataSources } from '../../../modules/dataSource';
import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';
import messages from './createDataSourceState.messages';
import {
  CREATE_PROJECT_STATE_FORM,
  INITIAL_VALUES,
  PROJECT_STATE_SCHEMA,
} from '../../../modules/dataSourceState/dataSourceState.constants';
import { DataSourceStateRoutines } from '../../../modules/dataSourceState';
import { selectProject } from '../../../modules/project';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  dataSources: selectDataSources,
  project: selectProject,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchDataSources: promisifyRoutine(DataSourceRoutines.fetchList),
      createState: promisifyRoutine(DataSourceStateRoutines.create),
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
    displayName: CREATE_PROJECT_STATE_FORM,
    enableReinitialize: true,
    mapPropsToValues: () => INITIAL_VALUES,
    validationSchema: () => PROJECT_STATE_SCHEMA,
    handleSubmit: async (formData, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const projectId = getMatchParam(props, 'projectId');

        await props.createState({ formData, projectId });
      } catch (errors) {
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(CreateDataSourceState);
