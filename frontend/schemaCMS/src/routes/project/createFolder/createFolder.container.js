import { connect } from 'react-redux';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { CreateFolder } from './createFolder.component';
import messages from './createFolder.messages';
import { FolderRoutines } from '../../../modules/folder';
import { FOLDER_FORM, FOLDER_SCHEMA, INITIAL_VALUES } from '../../../modules/folder/folder.constants';
import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';
import { selectUserRole } from '../../../modules/userProfile';

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      userRole: selectUserRole,
      createFolder: promisifyRoutine(FolderRoutines.create),
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
    displayName: FOLDER_FORM,
    enableReinitialize: true,
    mapPropsToValues: () => INITIAL_VALUES,
    validationSchema: () => FOLDER_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const projectId = getMatchParam(props, 'projectId');

        await props.createFolder({ projectId, ...data });
      } catch (errors) {
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(CreateFolder);
