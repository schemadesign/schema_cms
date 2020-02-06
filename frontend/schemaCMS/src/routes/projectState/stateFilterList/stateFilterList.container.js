import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose } from 'ramda';
import { injectIntl } from 'react-intl';
import { withFormik } from 'formik';

import { StateFilterList } from './stateFilterList.component';

import { errorMessageParser, getMatchParam } from '../../../shared/utils/helpers';
import messages from '../../project/create/create.messages';
import { ProjectStateRoutines, selectState } from '../../../modules/projectState';
import { selectUserRole } from '../../../modules/userProfile';
import { FilterRoutines, selectFilters } from '../../../modules/filter';

const mapStateToProps = createStructuredSelector({
  state: selectState,
  filters: selectFilters,
  userRole: selectUserRole,
});

export const mapDispatchToProps = dispatch => ({
  ...bindPromiseCreators(
    {
      fetchFilters: promisifyRoutine(FilterRoutines.fetchList),
      updateState: promisifyRoutine(ProjectStateRoutines.update),
    },
    dispatch
  ),
});

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
    mapPropsToValues: ({ state }) => state.filters.map(({ filter }) => filter),
    handleSubmit: async (values, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const stateId = getMatchParam(props, 'stateId');
        const { filters, project } = props.state;
        const redirectUrl = `/project/${project}/state`;
        const formData = { filters: filters.filter(({ filter }) => values.includes(filter)) };

        await props.updateState({ formData, stateId, redirectUrl });
      } catch (errors) {
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(StateFilterList);
