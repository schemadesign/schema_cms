import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { StateTag } from './stateTag.component';
import { ProjectStateRoutines, selectState } from '../../../modules/projectState';
import { selectUserRole } from '../../../modules/userProfile';
import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';
import messages from '../../project/create/create.messages';
import { DataSourceTagRoutines, selectTags } from '../../../modules/dataSourceTag';

const mapStateToProps = createStructuredSelector({
  state: selectState,
  userRole: selectUserRole,
  tags: selectTags,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchTags: promisifyRoutine(DataSourceTagRoutines.fetchList),
      updateState: promisifyRoutine(ProjectStateRoutines.update),
    },
    dispatch
  ),
});

export default compose(
  hot(module),
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
  withRouter,
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ state }) => state.activeTags,
    handleSubmit: async (activeTags, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const stateId = getMatchParam(props, 'stateId');
        const redirectUrl = `/state/${stateId}/filters`;

        await props.updateState({ formData: { activeTags }, stateId, redirectUrl });
      } catch (errors) {
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(StateTag);
