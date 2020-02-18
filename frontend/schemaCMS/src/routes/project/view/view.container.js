import { connect } from 'react-redux';
import { promisifyRoutine, bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';
import { compose, pick } from 'ramda';

import { View } from './view.component';
import { ProjectRoutines } from '../../../modules/project';
import { selectProject } from '../../../modules/project/project.selectors';
import { selectIsAdmin, selectUserRole } from '../../../modules/userProfile/userProfile.selectors';
import { INITIAL_VALUES, PROJECT_SCHEMA } from '../../../modules/project/project.constants';
import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';
import messages from '../create/create.messages';
import reportError from '../../../shared/utils/reportError';

const mapStateToProps = createStructuredSelector({
  isAdmin: selectIsAdmin,
  project: selectProject,
  userRole: selectUserRole,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchProject: promisifyRoutine(ProjectRoutines.fetchOne),
      editProject: promisifyRoutine(ProjectRoutines.editProject),
      unmountProject: promisifyRoutine(ProjectRoutines.unmountOne),
      removeProject: promisifyRoutine(ProjectRoutines.removeOne),
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl,
  withRouter,
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ project }) => ({
      ...INITIAL_VALUES,
      ...pick(['title', 'description', 'status'], project),
    }),
    validationSchema: () => PROJECT_SCHEMA,
    handleSubmit: async (formData, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const projectId = getMatchParam(props, 'projectId');

        await props.editProject({ formData, projectId });
      } catch (errors) {
        reportError(errors);
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(View);
