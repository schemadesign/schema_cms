import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { withFormik } from 'formik';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';

import { Create } from './create.component';
import messages from './create.messages';
import { CREATE_PROJECT_FORM, INITIAL_VALUES, PROJECT_SCHEMA } from '../../../modules/project/project.constants';
import { ProjectRoutines } from '../../../modules/project/project.redux';
import { selectIsAdmin, selectUserData, selectUserRole } from '../../../modules/userProfile';
import { errorMessageParser } from '../../../shared/utils/helpers';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  currentUser: selectUserData,
  isAdmin: selectIsAdmin,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      createProject: promisifyRoutine(ProjectRoutines.createProject),
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  injectIntl,
  withFormik({
    displayName: CREATE_PROJECT_FORM,
    enableReinitialize: true,
    mapPropsToValues: ({ currentUser: { firstName, lastName } }) => ({
      ...INITIAL_VALUES,
      owner: `${firstName} ${lastName}`,
    }),
    validationSchema: () => PROJECT_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);

        await props.createProject(data);
      } catch (errors) {
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(Create);
