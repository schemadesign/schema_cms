import { connect } from 'react-redux';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose, path } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { CreateDirectory } from './createDirectory.component';
import messages from './createDirectory.messages';
import { DirectoryRoutines } from '../../../modules/directory';
import { DIRECTORY_FORM, DIRECTORY_SCHEMA, INITIAL_VALUES } from '../../../modules/directory/directory.constants';
import { errorMessageParser } from '../../../shared/utils/helpers';

const mapStateToProps = createStructuredSelector({});

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
    enableReinitialize: true,
    mapPropsToValues: () => INITIAL_VALUES,
    validationSchema: () => DIRECTORY_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const projectId = path(['match', 'params', 'projectId'], props);

        await props.createDirectory({ projectId, ...data });
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