import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose, pick, pickBy } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';
import { withTheme } from 'styled-components';

import { Source } from './source.component';
import { DataSourceRoutines, selectDataSource, selectUploadingDataSources } from '../../../modules/dataSource';
import { selectIsAdmin, selectUserRole } from '../../../modules/userProfile';
import { errorMessageParser } from '../../../shared/utils/helpers';
import messages from './source.messages';
import {
  DATA_SOURCE_FIELDS,
  DATA_SOURCE_FORM,
  DATA_SOURCE_SCHEMA,
  DATA_SOURCE_RUN_LAST_JOB,
  DATA_SOURCE_FILE_NAME,
  DATA_SOURCE_TYPE,
  SOURCE_TYPE_FILE,
} from '../../../modules/dataSource/dataSource.constants';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  dataSource: selectDataSource,
  uploadingDataSources: selectUploadingDataSources,
  isAdmin: selectIsAdmin,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      removeDataSource: promisifyRoutine(DataSourceRoutines.removeOne),
      onDataSourceChange: promisifyRoutine(DataSourceRoutines.updateOne),
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
  withTheme,
  withFormik({
    displayName: DATA_SOURCE_FORM,
    enableReinitialize: true,
    mapPropsToValues: ({ dataSource }) => ({
      ...pick(DATA_SOURCE_FIELDS, dataSource),
      [DATA_SOURCE_FILE_NAME]:
        dataSource[DATA_SOURCE_TYPE] === SOURCE_TYPE_FILE ? dataSource[DATA_SOURCE_FILE_NAME] : null,
      [DATA_SOURCE_RUN_LAST_JOB]: false,
    }),
    validationSchema: () => DATA_SOURCE_SCHEMA,
    handleSubmit: async (values, { props, setSubmitting, setErrors }) => {
      const { onDataSourceChange, intl, dataSource } = props;

      try {
        setSubmitting(true);
        const requestData = pickBy((val, key) => val !== dataSource[key], values);

        await onDataSourceChange({ requestData, dataSource });
      } catch (errors) {
        const { formatMessage } = intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(Source);
