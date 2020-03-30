import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose, keys, pick } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { Edit } from './edit.component';
import { ProjectStateRoutines, selectState } from '../../../modules/projectState';
import {
  CREATE_PROJECT_STATE_FORM,
  INITIAL_VALUES,
  PROJECT_STATE_SCHEMA,
} from '../../../modules/projectState/projectState.constants';
import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';
import messages from './edit.messages';
import { selectUserRole } from '../../../modules/userProfile';
import { DataSourceRoutines, selectDataSources } from '../../../modules/dataSource';

const mapStateToProps = createStructuredSelector({
  state: selectState,
  userRole: selectUserRole,
  dataSources: selectDataSources,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      updateState: promisifyRoutine(ProjectStateRoutines.update),
      removeState: promisifyRoutine(ProjectStateRoutines.remove),
      fetchDataSources: promisifyRoutine(DataSourceRoutines.fetchList),
    },
    dispatch
  ),
});

export default compose(
  hot(module),
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
  withRouter,
  withFormik({
    displayName: CREATE_PROJECT_STATE_FORM,
    enableReinitialize: true,
    isInitialValid: true,
    mapPropsToValues: ({ state }) => ({ ...pick(keys(INITIAL_VALUES), state) }),
    validationSchema: () => PROJECT_STATE_SCHEMA,
    handleSubmit: async (formData, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const stateId = getMatchParam(props, 'stateId');
        const redirectUrl = `/state/${stateId}/tags`;

        await props.updateState({ formData, stateId, redirectUrl });
      } catch (errors) {
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(Edit);
