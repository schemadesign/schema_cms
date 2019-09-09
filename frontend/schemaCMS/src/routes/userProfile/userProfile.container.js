import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { withFormik } from 'formik';
import { injectIntl } from 'react-intl';

import { UserProfile } from './userProfile.component';
import {
  USER_PROFILE_FORM,
  USER_PROFILE_SCHEMA,
  INITIAL_VALUES,
} from '../../modules/userProfile/userProfile.constants';
import { selectUserData, UserProfileRoutines } from '../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  userData: selectUserData,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateMe: UserProfileRoutines.updateMe,
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
    displayName: USER_PROFILE_FORM,
    mapPropsToValues: ({ userData }) => ({
      ...INITIAL_VALUES,
      ...userData,
      email: 'testemail@test.com',
    }),
    validationSchema: () => USER_PROFILE_SCHEMA,
    enableReinitialize: true,
    isInitialValid: true,
    handleSubmit: async (data, { props, ...formik }) => {
      try {
        formik.setSubmitting(true);

        await props.updateMe(data);
      } catch ({ errors }) {
        formik.setErrors(errors);
      } finally {
        formik.setSubmitting(false);
      }
    },
  })
)(UserProfile);
