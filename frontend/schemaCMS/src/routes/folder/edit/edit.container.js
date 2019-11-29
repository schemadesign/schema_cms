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
import { FolderRoutines, selectFolder } from '../../../modules/folder';
import { FOLDER_FORM, FOLDER_NAME, FOLDER_SCHEMA, INITIAL_VALUES } from '../../../modules/folder/folder.constants';
import { errorMessageParser } from '../../../shared/utils/helpers';

const mapStateToProps = createStructuredSelector({
  folder: selectFolder,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      updateFolder: promisifyRoutine(FolderRoutines.update),
      fetchFolder: promisifyRoutine(FolderRoutines.fetchOne),
      removeFolder: promisifyRoutine(FolderRoutines.removeOne),
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
    mapPropsToValues: ({ folder }) => ({
      ...INITIAL_VALUES,
      [FOLDER_NAME]: folder.name,
    }),
    validationSchema: () => FOLDER_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const folderId = path(['match', 'params', 'folderId'], props);
        const projectId = path(['folder', 'project'], props);

        await props.updateFolder({ folderId, projectId, ...data });
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
