import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { withFormik } from 'formik';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';

import { Create } from './create.component';
import { INITIAL_VALUES, PROJECT_SCHEMA, CREATE_PROJECT_FORM } from '../../../modules/project/project.constants';
import { ProjectRoutines } from '../../../modules/project/project.redux';

const mapStateToProps = createStructuredSelector({});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createProject: ProjectRoutines.createProject,
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
    displayName: CREATE_PROJECT_FORM,
    isInitialValid: true,
    mapPropsToValues: () => INITIAL_VALUES,
    validationSchema: () => PROJECT_SCHEMA,
    handleSubmit: async (data, { props, ...formik }) => {
      try {
        formik.setSubmitting(true);

        await props.createProject(data);
      } catch ({ errors }) {
        formik.setErrors(errors);
      } finally {
        formik.setSubmitting(false);
      }
    },
  })
)(Create);
