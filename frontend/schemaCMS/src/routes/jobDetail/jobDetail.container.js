import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { withFormik } from 'formik';
import { injectIntl } from 'react-intl';

import { JobDetail } from './jobDetail.component';
import { JobRoutines, selectJob } from '../../modules/job';
import { JOB_DETAIL_FORM, INITIAL_VALUES, JOB_DETAIL_SCHEMA } from '../../modules/job/job.constants';

const mapStateToProps = createStructuredSelector({
  job: selectJob,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchOne: promisifyRoutine(JobRoutines.fetchOne),
      updateJobDetail: promisifyRoutine(JobRoutines.updateOne),
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
    displayName: JOB_DETAIL_FORM,
    enableReinitialize: true,
    mapPropsToValues: ({ job: { description, id } }) => ({
      ...INITIAL_VALUES,
      description,
      id,
    }),
    validationSchema: () => JOB_DETAIL_SCHEMA,
    handleSubmit: async (data, { props, ...formik }) => {
      try {
        formik.setSubmitting(true);
        await props.updateJobDetail(data);
      } catch ({ errors }) {
        formik.setErrors(errors);
      } finally {
        formik.setSubmitting(false);
      }
    },
  })
)(JobDetail);
