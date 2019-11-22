import { connect } from 'react-redux';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { CreateDirectory } from './createDirectory.component';
import { DirectoryRoutines, selectDirectoryName } from '../../../modules/directory';
import { errorMessageParser } from '../../../shared/utils/helpers';
import {
  DIRECTORY_FORM,
  DIRECTORY_NAME,
  DIRECTORY_SCHEMA,
  INITIAL_VALUES,
} from '../../../modules/directory/directory.constants';

const mapStateToProps = createStructuredSelector({
  directoryName: selectDirectoryName,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      createDirectory: promisifyRoutine(DirectoryRoutines.create),
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRouter,
  injectIntl,
  withFormik({
    displayName: DIRECTORY_FORM,
    isInitialValid: true,
    enableReinitialize: true,
    mapPropsToValues: ({ directoryName }) => ({
      ...INITIAL_VALUES,
      [DIRECTORY_NAME]: directoryName,
    }),
    validationSchema: () => DIRECTORY_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);

        await props.createDirectory(data);
      } catch (errors) {
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(CreateDirectory);
