import { connect } from 'react-redux';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose, path } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { Edit } from './edit.component';
import messages from './edit.messages';
import { DirectoryRoutines, selectDirectory } from '../../../modules/directory';
import {
  DIRECTORY_FORM,
  DIRECTORY_NAME,
  DIRECTORY_SCHEMA,
  INITIAL_VALUES,
} from '../../../modules/directory/directory.constants';
import { errorMessageParser } from '../../../shared/utils/helpers';

const mapStateToProps = createStructuredSelector({
  directory: selectDirectory,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      updateDirectory: promisifyRoutine(DirectoryRoutines.update),
      fetchDirectory: promisifyRoutine(DirectoryRoutines.fetchOne),
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
    enableReinitialize: true,
    mapPropsToValues: ({ directory }) => ({
      ...INITIAL_VALUES,
      [DIRECTORY_NAME]: directory.name,
    }),
    validationSchema: () => DIRECTORY_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const directoryId = path(['match', 'params', 'directoryId'], props);
        const projectId = path(['directory', 'project'], props);

        await props.updateDirectory({ directoryId, projectId, ...data });
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
